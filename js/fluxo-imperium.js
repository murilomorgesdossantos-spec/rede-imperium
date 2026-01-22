// ============================================================
// CONFIGURAÇÃO GLOBAL
// ============================================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7e1QWZJjw-tjuuOwU65jy4Mak4srwu-MhG_J3z2HKuc1FHaIIOvcy_3U1XwAFeHmmsw/exec'; 

// ============================================================
// 1. GERENCIAMENTO DE USUÁRIO (ID ÚNICO)
// ============================================================
function getUniqueUserId() {
    let userId = localStorage.getItem('imperium_user_id');
    if (!userId) {
        // Gera ID: user_TIMESTAMP_RANDOM
        userId = 'user_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
        localStorage.setItem('imperium_user_id', userId);
    }
    return userId;
}

// Formatação BRL
const formatarMoeda = (valor) => {
    // Se vier texto "R$ 20,00", tenta limpar. Se for número, formata.
    if(typeof valor === 'string') return valor; 
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};

// ============================================================
// 2. LÓGICA DE COMPRA (GENÉRICA PARA QUALQUER PÁGINA)
// ============================================================

/**
 * Função chamada pelo botão HTML.
 * @param {HTMLElement} btnElement - O botão que foi clicado (this)
 * @param {string} nomeProduto - Nome do item
 * @param {number|string} preco - Preço do item
 * @param {string} imagemUrl - (Opcional) URL da imagem para o carrinho
 */
window.comprarItem = function(btnElement, nomeProduto, preco, imagemUrl = '') {
    // 1. Verifica se já foi comprado (Botão virou "Ver Carrinho")
    const textoAtual = btnElement.innerText.trim();
    if (textoAtual.includes("Ver Carrinho")) {
        window.location.href = 'carrinho.html';
        return;
    }

    // 2. Feedback Visual (Loading)
    const htmlOriginal = btnElement.innerHTML;
    btnElement.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';
    btnElement.disabled = true;

    // 3. Prepara dados
    const dados = {
        id: getUniqueUserId(),
        produto: nomeProduto,
        preco: preco,
        imagem: imagemUrl,
        // Quantidade é definida como 1 no Backend (Google Script)
    };

    // 4. Envia para o Google Sheets
    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Importante para enviar ao Google sem erro de CORS
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    })
    .then(() => {
        // 5. Sucesso: Transforma botão em "Ver Carrinho"
        btnElement.disabled = false;
        btnElement.classList.remove('btn-primary');
        btnElement.classList.add('btn-success'); // Muda cor para verde
        btnElement.innerHTML = '<i class="fa-solid fa-check"></i> Ver Carrinho';
        
        // Notificação (se Toastify existir)
        if(typeof Toastify === 'function'){
            Toastify({ text: "Item salvo na nuvem!", duration: 3000, style: { background: "#43fb45" } }).showToast();
        }
    })
    .catch(error => {
        console.error("Erro:", error);
        btnElement.innerHTML = htmlOriginal;
        btnElement.disabled = false;
        alert("Erro de conexão com o servidor.");
    });
};

// ============================================================
// 3. LÓGICA DO CARRINHO (CARREGA DA PLANILHA)
// ============================================================
function carregarCarrinhoDaNuvem() {
    // Verifica se estamos na página do carrinho procurando pelo corpo da tabela
    const tbody = document.getElementById('cart-items-body'); // <--- Crie esse ID no seu HTML do carrinho
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.querySelector('.cc__checkout___footer_finish strong:last-child');
    const btnCheckout = document.getElementById('checkout');

    if (!tbody) return; // Não estamos na página carrinho

    // Loading inicial
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;"><i class="fa-solid fa-spinner fa-spin"></i> Buscando seus itens...</td></tr>';

    const userId = getUniqueUserId();

    fetch(`${GOOGLE_SCRIPT_URL}?id=${userId}`)
        .then(response => response.json())
        .then(itens => {
            tbody.innerHTML = ''; 

            if (!itens || itens.length === 0) {
                tbody.innerHTML = '<tr class="cc__checkout___no_products" style="display: table-row"><td colspan="5"><p>Seu carrinho está vazio.</p></td></tr>';
                if(subtotalEl) subtotalEl.innerText = formatarMoeda(0);
                if(totalEl) totalEl.innerText = formatarMoeda(0);
                if(btnCheckout) btnCheckout.innerText = "Carrinho Vazio";
                return;
            }

            let totalGeral = 0;

            itens.forEach((item) => {
                // Tenta limpar o "R$" caso venha da planilha como texto, para somar
                let valorNumerico = item.preco;
                if (typeof item.preco === 'string') {
                     valorNumerico = parseFloat(item.preco.replace('R$', '').replace('.', '').replace(',', '.').trim());
                }
                
                if (isNaN(valorNumerico)) valorNumerico = 0;

                totalGeral += valorNumerico;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            ${item.imagem ? `<img src="${item.imagem}" width="50" style="border-radius: 5px;">` : ''}
                            <div><span style="font-weight: bold; color: white;">${item.produto}</span></div>
                        </div>
                    </td>
                    <td>${formatarMoeda(valorNumerico)}</td>
                    <td><span style="color: white;">1x</span></td>
                    <td style="color: #43fb45;">${formatarMoeda(valorNumerico)}</td>
                    <td><i class="fa-solid fa-check" title="Salvo na nuvem"></i></td>
                `;
                tbody.appendChild(row);
            });

            if (subtotalEl) subtotalEl.innerText = formatarMoeda(totalGeral);
            if (totalEl) totalEl.innerText = formatarMoeda(totalGeral);
            
            if(btnCheckout) {
                btnCheckout.innerText = `Finalizar (${formatarMoeda(totalGeral)})`;
                // Aqui mantemos seu modal de checkout original
                btnCheckout.onclick = function() {
                    const modal = new bootstrap.Modal(document.getElementById('checkout-modal'));
                    modal.show();
                };
            }
        })
        .catch(error => {
            console.error(error);
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: #ff5c5c;">Erro ao carregar dados.</td></tr>';
        });
}

// Inicializa o carrinho se a página carregar
document.addEventListener('DOMContentLoaded', () => {
    carregarCarrinhoDaNuvem();
});