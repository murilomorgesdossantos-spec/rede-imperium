// ATENÇÃO: Verifique se a URL é a mesma do seu Google Script atual
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7e1QWZJjw-tjuuOwU65jy4Mak4srwu-MhG_J3z2HKuc1FHaIIOvcy_3U1XwAFeHmmsw/exec'; 

function getUserId() {
    return localStorage.getItem('imperium_user_id');
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

function carregarCarrinho() {
    const tbody = document.getElementById('cart-items-body');
    
    // Elementos do Rodapé
    const elSubtotal = document.getElementById('display-subtotal');
    const elDiscount = document.getElementById('display-discount');
    const elBadge = document.getElementById('badge-discount');
    const elTotal = document.getElementById('display-total');
    const btnCheckout = document.getElementById('checkout');

    if (!tbody) return;

    // Colspan 5 para cobrir toda a largura (Produto, Preço, Qtd, Total, Lixeira)
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;"><i class="fa-solid fa-spinner fa-spin"></i> Atualizando carrinho...</td></tr>';

    const userId = getUserId();
    if (!userId) {
        exibirVazio(tbody, elSubtotal, elDiscount, elTotal, btnCheckout);
        return;
    }

    fetch(`${GOOGLE_SCRIPT_URL}?id=${userId}`)
        .then(response => response.json())
        .then(itens => {
            tbody.innerHTML = ''; 

            if (!itens || itens.length === 0 || itens.error) {
                exibirVazio(tbody, elSubtotal, elDiscount, elTotal, btnCheckout);
                return;
            }

            let mathSubtotal = 0; // Soma dos preços ORIGINAIS
            let mathTotal = 0;    // Soma dos preços FINAIS (O que paga)

            itens.forEach((item) => {
                // Conversão segura dos dados vindos do Google Script
                let valFinalTotal = parseFloat(item.valorTotalLinha); // Coluna E (Total Pago)
                let valOriginalUnit = parseFloat(item.valorOriginalUnit); // Coluna H (Original Unitário)
                let qtd = parseInt(item.quantidade) || 1;

                // Proteção: Se a planilha não tiver o total, zera
                if (isNaN(valFinalTotal)) valFinalTotal = 0;
                
                // Proteção: Se não tiver original (itens antigos), assume igual ao final
                if (isNaN(valOriginalUnit) || valOriginalUnit === 0) {
                    valOriginalUnit = (valFinalTotal / qtd);
                }

                // Cálculo do Original Total da linha (para somar no subtotal)
                const totalOriginalLinha = valOriginalUnit * qtd;

                // Acumuladores Globais
                mathTotal += valFinalTotal;
                mathSubtotal += totalOriginalLinha;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="${item.imagem}" width="50" style="border-radius: 5px;" onerror="this.src='https://placehold.co/50x50?text=IMG'">
                            <div><span style="font-weight: bold; color: white;">${item.produto}</span></div>
                        </div>
                    </td>
                    
                    <td style="color: #a09fb2; text-decoration: line-through; font-size: 0.9em;">
                        ${formatarMoeda(valOriginalUnit)}
                    </td>
                    
                    <td><span style="color: white;">${qtd}x</span></td>
                    
                    <td style="color: #43fb45; font-weight: bold;">
                        ${formatarMoeda(valFinalTotal)}
                    </td>
                    
                    <td style="text-align: right;">
                        <button onclick="removerItem('${item.slug}', this)" class="btn-lixeira" title="Remover">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });

            // === CÁLCULOS DO RODAPÉ ===
            const valDesconto = mathSubtotal - mathTotal;
            
            // 1. Subtotal: Soma dos Originais (Ex: R$ 400,00)
            if (elSubtotal) elSubtotal.innerText = formatarMoeda(mathSubtotal);
            
            // 2. Descontos: Diferença (Ex: - R$ 280,00)
            if (elDiscount) {
                elDiscount.innerText = `- ${formatarMoeda(valDesconto)}`;
                
                // Badge de Porcentagem
                if (elBadge) {
                    if (mathSubtotal > 0 && valDesconto > 0.01) {
                        const pct = Math.round((valDesconto / mathSubtotal) * 100);
                        elBadge.innerText = `${pct}%`;
                        elBadge.style.display = 'inline-block';
                    } else {
                        elBadge.style.display = 'none';
                    }
                }
            }

            // 3. Total: Soma dos Finais (Ex: R$ 120,00)
            if (elTotal) elTotal.innerText = formatarMoeda(mathTotal);
            
            // Botão Checkout
            if(btnCheckout) {
                btnCheckout.innerText = `Finalizar (${formatarMoeda(mathTotal)})`;
                btnCheckout.onclick = () => {
                   const modal = new bootstrap.Modal(document.getElementById('checkout-modal'));
                   modal.show();
                };
            }
        })
        .catch(error => {
            console.error(error);
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: #ff5c5c;">Erro de conexão.</td></tr>`;
        });
}

window.removerItem = function(slug, btn) {
    const userId = getUserId();
    if(btn) btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: 'remove',
            id: userId,
            slug: slug
        })
    })
    .then(() => {
        setTimeout(carregarCarrinho, 1000);
    });
};

function exibirVazio(tbody, sub, disc, total, btn) {
    tbody.innerHTML = `
        <tr class="cc__checkout___no_products" style="display: table-row">
            <td colspan="5"><p>Seu carrinho está vazio.</p></td>
        </tr>`;
    if(sub) sub.innerText = formatarMoeda(0);
    if(disc) disc.innerText = "- " + formatarMoeda(0);
    if(total) total.innerText = formatarMoeda(0);
    if(btn) {
        btn.innerText = "Carrinho Vazio";
        btn.onclick = null;
    }
}

document.addEventListener('DOMContentLoaded', carregarCarrinho);