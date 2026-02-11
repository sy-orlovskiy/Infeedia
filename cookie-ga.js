// -------------------- GA4 через Measurement Protocol --------------------
function sendGA4Event(name, params) {
  var measurement_id = "G-ВАШ_ID";      // Замените на ваш GA4 Measurement ID
  var api_secret = "ВАШ_SECRET_KEY";    // Замените на Measurement Protocol Secret

  var client_id = localStorage.getItem("ga_client_id");
  if(!client_id){
    client_id = Math.random().toString(36).substring(2) + Date.now().toString();
    localStorage.setItem("ga_client_id", client_id);
  }

  navigator.sendBeacon(
    "https://www.google-analytics.com/mp/collect?measurement_id=" + measurement_id + "&api_secret=" + api_secret,
    JSON.stringify({
      client_id: client_id,
      events: [{ name: name, params: params }]
    })
  );
}

function updateConsent(status) {
  if(status === 'granted'){
    // Отправка pageview после согласия
    sendGA4Event("page_view", { page_location: window.location.href });
  }
}

// -------------------- Баннер Cookie --------------------
document.addEventListener("DOMContentLoaded", function(){

  // -------------------- Создание баннера --------------------
  if(document.getElementById('cookie-banner')) return; // избегаем дублирования

  var banner = document.createElement('div');
  banner.id = "cookie-banner";
  banner.innerHTML = `
    <div class="cookie-text">
      <div class="cookie-main" id="cookie-main-text"></div>
      <div class="cookie-links">
        <a id="policy-link" href="#"></a>
        <span id="and-text"></span>
        <a id="cookie-link" href="#"></a>
      </div>
    </div>
    <div class="cookie-buttons">
      <button class="reject-btn" id="reject-btn"></button>
      <button class="accept-btn" id="accept-btn"></button>
    </div>
  `;
  document.body.appendChild(banner);

  // -------------------- Стили --------------------
  var style = document.createElement('style');
  style.innerHTML = `
    #cookie-banner { position: fixed; bottom:32px; right:32px; background:#66001F; color:#EAE4D6; padding:16px 18px; max-width:520px; width:calc(100% - 64px); z-index:9999; font-size:14px; line-height:1.4; box-sizing:border-box; display:none; }
    .cookie-text{display:flex;flex-wrap:wrap;align-items:center;gap:6px;}
    .cookie-main{flex:1 1 auto;min-width:0;}
    .cookie-links{display:flex;flex-wrap:wrap;gap:6px;min-width:0;}
    .cookie-links a{color:#EAE4D6;text-decoration:underline;word-break:break-word;}
    .cookie-buttons{margin-top:14px;display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;flex-direction:row-reverse;}
    .cookie-buttons button{min-width:110px;padding:6px 14px;font-size:14px;cursor:pointer;border-radius:0;}
    .accept-btn{background:#EAE4D6;color:#66001F;border:1px solid #EAE4D6;}
    .reject-btn{background:transparent;color:#EAE4D6;border:1px solid #EAE4D6;}
    @media(max-width:991px){#cookie-banner{right:20px;left:20px;bottom:20px;width:auto;}}
    @media(max-width:479px){#cookie-banner{right:16px;left:16px;bottom:16px;}.cookie-text{align-items:flex-start;}}
  `;
  document.head.appendChild(style);

  // -------------------- Локализация --------------------
  var path = window.location.pathname;
  var isCZ = path === '/cz' || path.startsWith('/cz/');

  if(isCZ){
    document.getElementById('cookie-main-text').textContent='Používáme soubory cookie pro analýzu a zlepšení fungování webu.';
    document.getElementById('policy-link').textContent='Zásady ochrany osobních údajů';
    document.getElementById('policy-link').href='/cz/policy';
    document.getElementById('and-text').textContent='a';
    document.getElementById('cookie-link').textContent='Zásady cookies';
    document.getElementById('cookie-link').href='/cz/cookie';
    document.getElementById('accept-btn').textContent='Přijmout';
    document.getElementById('reject-btn').textContent='Odmítnout';
  } else {
    document.getElementById('cookie-main-text').textContent='Ми використовуємо файли cookie для аналітики та покращення роботи сайту.';
    document.getElementById('policy-link').textContent='Політика конфіденційності';
    document.getElementById('policy-link').href='/ua/policy';
    document.getElementById('and-text').textContent='та';
    document.getElementById('cookie-link').textContent='Політика cookie';
    document.getElementById('cookie-link').href='/ua/cookie';
    document.getElementById('accept-btn').textContent='Прийняти';
    document.getElementById('reject-btn').textContent='Відхилити';
  }

  // -------------------- Кнопки --------------------
  var acceptBtn = document.getElementById('accept-btn');
  var rejectBtn = document.getElementById('reject-btn');

  acceptBtn.addEventListener("click", function(){
    localStorage.setItem('cookie_consent','granted');
    if(typeof updateConsent==='function') updateConsent('granted');
    banner.style.display='none';
  });
  rejectBtn.addEventListener("click", function(){
    localStorage.setItem('cookie_consent','denied');
    if(typeof updateConsent==='function') updateConsent('denied');
    banner.style.display='none';
  });

  // -------------------- Проверка согласия --------------------
  var consent = localStorage.getItem('cookie_consent');
  if(consent==='granted'){ if(typeof updateConsent==='function') updateConsent('granted'); }
  else if(consent==='denied'){ if(typeof updateConsent==='function') updateConsent('denied'); }
  else { banner.style.display='block'; }

});
