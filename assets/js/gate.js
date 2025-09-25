// assets/js/gate.js — v4 (lokal kullanım için güvenli)
(function(){
  const PASS = "20061016";
  const KEY  = "auth";

  // zaten açıksa çık
  if (sessionStorage.getItem(KEY) === "ok") return;

  // Overlay HTML (gömülü stillerle)
  const overlayHTML = `
  <div id="gate-overlay" style="
    position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
    background:#f9d5d3;z-index:2147483647;
  ">
    <div id="gate-box" style="
      width:min(92vw,420px);background:#ffffff;border:1px solid #e9e9e9;border-radius:16px;
      box-shadow:0 10px 24px rgba(0,0,0,.15);padding:20px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#222;
    ">
      <h1 style="margin:0 0 10px;font-size:20px;">🔒 Giriş</h1>
      <p style="margin:0 0 12px;color:#555;">Devam etmek için şifreyi gir.</p>
      <div class="row" style="display:flex;gap:8px;">
        <input id="gate-pass" type="password" placeholder="Şifre" style="
          flex:1;padding:12px 14px;font-size:16px;border:1px solid #ddd;border-radius:12px;
          outline:none;background:#fff;color:#111;box-shadow:inset 0 1px 2px rgba(0,0,0,.05);
        ">
        <button id="gate-btn" style="
          padding:12px 16px;font-weight:800;background:#111;color:#fff;border:none;border-radius:12px;cursor:pointer;
        ">Giriş</button>
      </div>
      <div id="gate-error" style="color:#b30000;font-size:13px;margin-top:8px;min-height:1em;"></div>
    </div>
  </div>`;

  function injectOverlay() {
    if (document.getElementById('gate-overlay')) return true;
    if (!document.body) return false;
    const wrap = document.createElement('div');
    wrap.innerHTML = overlayHTML;
    document.body.appendChild(wrap.firstElementChild);
    const inp = document.getElementById('gate-pass');
    if (inp) setTimeout(()=>inp.focus(), 50);
    return true;
  }

  // 1) ÖNCE overlay’i ekle
  if (!injectOverlay()) {
    // body henüz yoksa, hazır olunca ekle
    document.addEventListener('DOMContentLoaded', ()=>{ injectOverlay(); lock(); }, { once:true });
  } else {
    // body vardı, ekledik → sonra lock
    lock();
  }

  // 2) SONRA sayfayı kilitle
  function lock(){
    document.documentElement.classList.add('locked');
  }

  function unlock(){
    document.documentElement.classList.remove('locked');
    const el = document.getElementById('gate-overlay');
    if(el) el.remove();
    sessionStorage.setItem(KEY, "ok");
  }

  function showError(msg){
    const e = document.getElementById('gate-error');
    if(e){ e.textContent = msg || "Hatalı şifre."; }
  }

  // Olaylar
  document.addEventListener('click', (e)=>{
    if(e.target && e.target.id === 'gate-btn'){
      const val = document.getElementById('gate-pass')?.value || "";
      (val === PASS) ? unlock() : showError("Hatalı şifre.");
    }
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){
      const input = document.getElementById('gate-pass');
      if(input && document.documentElement.classList.contains('locked')){
        const val = input.value || "";
        (val === PASS) ? unlock() : showError("Hatalı şifre.");
      }
    }
  });
})();
