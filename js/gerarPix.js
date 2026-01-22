class Pix {
    constructor(chave, nome, cidade, valor, txid = '***') {
        this.chave = chave;
        this.nome = nome;
        this.cidade = cidade;
        this.valor = valor.toFixed(2);
        this.txid = txid;
        
        this.ID_PAYLOAD_FORMAT_INDICATOR = '00';
        this.ID_MERCHANT_ACCOUNT_INFORMATION = '26';
        this.ID_MERCHANT_ACCOUNT_INFORMATION_GUI = '00';
        this.ID_MERCHANT_ACCOUNT_INFORMATION_KEY = '01';
        this.ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION = '02';
        this.ID_MERCHANT_CATEGORY_CODE = '52';
        this.ID_TRANSACTION_CURRENCY = '53';
        this.ID_TRANSACTION_AMOUNT = '54';
        this.ID_COUNTRY_CODE = '58';
        this.ID_MERCHANT_NAME = '59';
        this.ID_MERCHANT_CITY = '60';
        this.ID_ADDITIONAL_DATA_FIELD_TEMPLATE = '62';
        this.ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID = '05';
        this.ID_CRC16 = '63';
    }

    _getValue(id, value) {
        const size = String(value.length).padStart(2, '0');
        return id + size + value;
    }

    _getMechantAccountInfo() {
        const gui = this._getValue(this.ID_MERCHANT_ACCOUNT_INFORMATION_GUI, 'br.gov.bcb.pix');
        const key = this._getValue(this.ID_MERCHANT_ACCOUNT_INFORMATION_KEY, this.chave);
        return this._getValue(this.ID_MERCHANT_ACCOUNT_INFORMATION, gui + key);
    }

    _getAdditionalDataFieldTemplate() {
        const txid = this._getValue(this.ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID, this.txid);
        return this._getValue(this.ID_ADDITIONAL_DATA_FIELD_TEMPLATE, txid);
    }

    _getCRC16(payload) {
        function ord(str) {
            return str.charCodeAt(0);
        }
        function dechex(number) {
            if (number < 0) {
                number = 0xFFFFFFFF + number + 1;
            }
            return parseInt(number, 10).toString(16).toUpperCase();
        }

        payload = payload + this.ID_CRC16 + '04';

        let polinomio = 0x1021;
        let resultado = 0xFFFF;

        if ((payload.length > 0)) {
            for (let offset = 0; offset < payload.length; offset++) {
                resultado ^= (ord(payload[offset]) << 8);
                for (let bitwise = 0; bitwise < 8; bitwise++) {
                    if ((resultado <<= 1) & 0x10000) resultado ^= polinomio;
                    resultado &= 0xFFFF;
                }
            }
        }
        return this.ID_CRC16 + '04' + dechex(resultado);
    }

    getPayload() {
        const payload = this._getValue(this.ID_PAYLOAD_FORMAT_INDICATOR, '01') +
                        this._getMechantAccountInfo() +
                        this._getValue(this.ID_MERCHANT_CATEGORY_CODE, '0000') +
                        this._getValue(this.ID_TRANSACTION_CURRENCY, '986') +
                        this._getValue(this.ID_TRANSACTION_AMOUNT, this.valor) +
                        this._getValue(this.ID_COUNTRY_CODE, 'BR') +
                        this._getValue(this.ID_MERCHANT_NAME, this.nome) +
                        this._getValue(this.ID_MERCHANT_CITY, this.cidade) +
                        this._getAdditionalDataFieldTemplate();

        return payload + this._getCRC16(payload);
    }
}

// ==========================================
// FUNÇÃO PARA O BOTÃO VERDE "COMPRAR"
// ==========================================
function finalizarCompraPix() {
    // 1. Configurações da sua conta
    const chavePix = "pixmorges@gmail.com"; 
    const nomeBeneficiario = "IMPERIUM"; 
    const cidadeBeneficiario = "CAMPO LARGO"; 
    
    // 2. Busca o valor no HTML pelo ID correto "display-total"
    let valorTotal = 0;
    const elementoValor = document.getElementById('display-total');
    
    // Se encontrou o elemento, limpa o texto (tira R$, espaços, etc)
    if (elementoValor) {
        let textoValor = elementoValor.innerText;
        // Remove "R$", espaços e troca vírgula por ponto para cálculo
        textoValor = textoValor.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
        valorTotal = parseFloat(textoValor);
    } else {
        alert("Erro técnico: Elemento 'display-total' não encontrado.");
        return;
    }

    // Verifica se o valor é válido
    if (isNaN(valorTotal) || valorTotal <= 0) {
        alert("Seu carrinho está vazio ou com valor inválido.");
        return;
    }

    // 3. Gera o código PIX
    const pix = new Pix(chavePix, nomeBeneficiario, cidadeBeneficiario, valorTotal);
    const payload = pix.getPayload();

    // 4. Preenche o Modal com as informações
    const inputCopiaCola = document.getElementById('pix-copia-cola');
    const displayValor = document.getElementById('pix-valor-display');
    const imgQr = document.getElementById('pix-qr-img');

    if(inputCopiaCola) inputCopiaCola.value = payload;
    if(displayValor) displayValor.innerText = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
    if(imgQr) imgQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(payload)}`;

    // 5. Abre o Modal (usando Bootstrap)
    const modalElement = document.getElementById('modalPix');
    if (modalElement && typeof bootstrap !== 'undefined') {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    } else {
        alert("Erro ao abrir modal. Verifique se o Bootstrap está carregado.");
    }
}

function copiarPix() {
    const copyText = document.getElementById("pix-copia-cola");
    if(!copyText) return;
    
    copyText.select();
    copyText.setSelectionRange(0, 99999); 
    navigator.clipboard.writeText(copyText.value);
    
    // Feedback visual no botão
    const btn = event.target;
    const textoOriginal = btn.innerText;
    btn.innerText = "Copiado!";
    setTimeout(() => { btn.innerText = textoOriginal; }, 2000);
}