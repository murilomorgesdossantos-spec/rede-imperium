// ============================================================
// CONFIGURAÇÃO - EXTRAS
// ============================================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7e1QWZJjw-tjuuOwU65jy4Mak4srwu-MhG_J3z2HKuc1FHaIIOvcy_3U1XwAFeHmmsw/exec'; 
let listaExtrasData = [];

// Gerencia ID do Usuário
function getUniqueUserId() {
    let userId = localStorage.getItem('imperium_user_id');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
        localStorage.setItem('imperium_user_id', userId);
    }
    return userId;
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

// ============================================================
// FUNÇÃO DE COMPRA (Genérica)
// ============================================================
window.comprarItem = function(btnElement) {
    const nome = btnElement.getAttribute('data-nome');
    const slug = btnElement.getAttribute('data-slug');
    const imagem = btnElement.getAttribute('data-imagem');
    const precoFinal = btnElement.getAttribute('data-preco'); 
    const precoOriginal = btnElement.getAttribute('data-original');

    if (btnElement.innerText.trim().includes("Ver Carrinho")) {
        window.location.href = 'carrinho.html';
        return;
    }

    const htmlOriginal = btnElement.innerHTML;
    btnElement.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';
    btnElement.disabled = true;

    fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: getUniqueUserId(),
            produto: nome,
            slug: slug,
            imagem: imagem,
            precoUnitario: precoFinal,
            precoOriginal: precoOriginal
        })
    })
    .then(() => {
        btnElement.disabled = false;
        btnElement.classList.remove('btn-primary');
        btnElement.classList.add('btn-success');
        btnElement.innerHTML = '<i class="fa-solid fa-check"></i> Ver Carrinho';
        
        if(typeof Toastify === 'function'){
            Toastify({ text: "Adicionado ao carrinho!", duration: 3000, style: { background: "#43fb45" } }).showToast();
        }
    })
    .catch(error => {
        console.error("Erro:", error);
        btnElement.innerHTML = htmlOriginal;
        btnElement.disabled = false;
        alert("Erro de conexão.");
    });
};

// ============================================================
// CARREGAR LISTA DE EXTRAS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // IMPORTANTE: No HTML extras.html, a div deve ter id="lista-extras"
    const container = document.getElementById('lista-extras');
    if (!container) return;

    fetch('./constants/extras.json')
        .then(res => res.json())
        .then(extras => {
            listaExtrasData = extras;
            let htmlContent = '';

            extras.forEach(item => {
                const badge = item.isNew ? `<span class="new">NOVIDADE</span>` : '';
                const nomeSeguro = String(item.name).replace(/"/g, '&quot;');
                
                // Lógica de exibição de desconto
                const displayDiscount = item.discount > 0 ? `-${item.discount}%` : '';
                const displayOriginal = item.discount > 0 ? formatarMoeda(item.originalPrice) : '';
                
                htmlContent += `
                  <div class="cc__product___wrapper">
                    ${badge}
                    <img src="${item.image}" width="165" alt="${item.name}">
                    <div class="cc__product___info">
                      <h1 title="${nomeSeguro}">${item.name}</h1>
                      
                      <p class="package-price">
                        <span class="double-price">${displayOriginal}</span>
                      </p>
                      
                      <div class="price-container">
                        <p class="package-price">
                          <span class="original-price">${formatarMoeda(item.price)}</span>
                          <span class="discount-percentage" style="${item.discount > 0 ? '' : 'display:none'}">${displayDiscount}</span>
                        </p>
                      </div>

                      <div class="cc__product___action">
                        <button type="button" 
                                onclick="comprarItem(this)" 
                                data-nome="${nomeSeguro}"
                                data-slug="${item.slug}"
                                data-preco="${item.price}" 
                                data-original="${item.originalPrice}" 
                                data-imagem="${item.image}"
                                class="btn-primary">
                          <i class="me-2 fa-solid fa-basket-shopping"></i> Adquirir
                        </button>
                    
                        <button class="btn-secondary" onclick="abrirModalDetalhes('${item.slug}')">
                          <i class="fa-regular fa-circle-question" style="font-size: 18px;"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                `;
            });
            container.innerHTML = htmlContent;
        })
        .catch(err => console.error("Erro ao carregar Extras:", err));
});

// Modal de Detalhes
window.abrirModalDetalhes = function(slug) {
    if (listaExtrasData.length === 0) return;
    const item = listaExtrasData.find(i => i.slug === slug);
    if (!item || typeof bootstrap === 'undefined') return;

    const modalContainer = document.getElementById('package-modal-container');
    const modalContentDiv = modalContainer.querySelector('.modal-content');
    const nomeSeguro = String(item.name).replace(/"/g, '&quot;');

    modalContentDiv.innerHTML = `
      <div class="modal-header">
        <h5 class="modal-title">${item.name}</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">${item.description}</div>
      <div class="modal-footer">
        <p class="cc__widget___product_modal_price">por <strong>${formatarMoeda(item.price)}</strong></p>
        <button type="button" class="btn-outline" data-bs-dismiss="modal">Fechar</button>
        <button type="button" 
                onclick="comprarItem(this)" 
                data-nome="${nomeSeguro}"
                data-slug="${item.slug}"
                data-preco="${item.price}"
                data-original="${item.originalPrice}"
                data-imagem="${item.image}"
                class="btn-primary">
          <i class="me-2 fa-solid fa-basket-shopping"></i> Adquirir
        </button>
      </div>
    `;
    new bootstrap.Modal(modalContainer).show();
};