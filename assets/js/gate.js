(function(){
  const PASS = "20061016";
  try{
    if (sessionStorage.getItem("gate-ok") === "1") return;
  }catch(e){}

  const ov = document.createElement('div');
  ov.className = 'gate-overlay';
  ov.innerHTML = `
    <div class="gate-card">
      <h3>🔒 Giriş</h3>
      <p class="muted">Lütfen şifreyi gir.</p>
      <div class="gate-row">
        <input id="gate-inp" class="gate-input" type="password" placeholder="Şifre">
        <button id="gate-btn" class="gate-btn">Giriş</button>
      </div>
      <div id="gate-hint" class="gate-hint"></div>
    </div>
  `;
  document.addEventListener('DOMContentLoaded', ()=>document.body.appendChild(ov));

  function allow(){
    try{ sessionStorage.setItem("gate-ok","1"); }catch(e){}
    ov.remove();
  }
  function check(){
    const v = document.getElementById('gate-inp').value.trim();
    if(v===PASS) allow(); else document.getElementById('gate-hint').textContent="Yanlış şifre.";
  }
  document.addEventListener('click', (e)=>{ if(e.target && e.target.id==='gate-btn') check(); });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Enter' && document.getElementById('gate-inp')) check(); });
})();
