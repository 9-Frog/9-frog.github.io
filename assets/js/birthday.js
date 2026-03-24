// Birthday — 16 Ekim (veya ?bday=1/true/yes/on) aktifse çalışır.
// Sadece aktifken Firebase modüllerini dinamik yükler (performans iyileştirme).

/* ——— Küçük yardımcılar ——— */
const $    = s => document.querySelector(s);
const esc  = (s='') => s.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const norm = s => (s||"").toLowerCase().replace(/ı/g,"i").replace(/[^\p{L}\p{N}]+/gu,"");
function lev(a,b){const m=a.length,n=b.length,dp=Array.from({length:m+1},()=>Array(n+1).fill(0));for(let i=0;i<=m;i++)dp[i][0]=i;for(let j=0;j<=n;j++)dp[0][j]=j;for(let i=1;i<=m;i++){for(let j=1;j<=n;j++){const c=a[i-1]===b[j-1]?0:1;dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+c)}}return dp[m][n]}
const looksLikeDeniz = name => { const n=norm(name); if(!n) return false; if(["deniz","denizim","denize","denizi"].includes(n)) return true; return lev(n,"deniz")<=1; };

const CAKE_GIF = "https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUya25qYWltdDJndThoZDlnM3kyMzZ6bGg2YzY5MGU2bjgyMm83N3RxNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7NpSWoebkmJuryOWOG/giphy.gif";
const STATIC_CAKE = `<svg viewBox="0 0 120 90" width="180" aria-hidden="true"><defs><linearGradient id="g1" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffd9d6"/><stop offset="1" stop-color="#ffcab5"/></linearGradient></defs><g fill="none" stroke="none"><rect x="10" y="48" width="100" height="28" rx="6" fill="url(#g1)"/><rect x="22" y="36" width="76" height="16" rx="5" fill="#fff1f4"/><circle cx="40" cy="36" r="3" fill="#ff9eb3"/><circle cx="60" cy="36" r="3" fill="#ffa94d"/><circle cx="80" cy="36" r="3" fill="#74c0fc"/><rect x="34" y="22" width="4" height="10" rx="2" fill="#8d6e63"/><rect x="58" y="22" width="4" height="10" rx="2" fill="#8d6e63"/><rect x="82" y="22" width="4" height="10" rx="2" fill="#8d6e63"/><path d="M36 20c1-2 4-2 5 0" stroke="#ffcc00" stroke-width="2" stroke-linecap="round"/><path d="M60 20c1-2 4-2 5 0" stroke="#ffcc00" stroke-width="2" stroke-linecap="round"/><path d="M84 20c1-2 4-2 5 0" stroke="#ffcc00" stroke-width="2" stroke-linecap="round"/></g></svg>`;

/* ——— URL parametresi ve tarih ——— */
function parseBdayParam(){
  const params = new URLSearchParams(location.search);
  const raw = (params.get('bday') || '').toLowerCase().trim();
  if (!raw) return null;
  const ON  = new Set(['1','true','yes','on']);
  const OFF = new Set(['0','false','no','off']);
  if (ON.has(raw))  return true;
  if (OFF.has(raw)) return false;
  return null;
}
function isBirthdayToday(){
  const now=new Date();
  return now.getMonth()===9 && now.getDate()===16; // 16 Ekim
}
const decideIsBday = () => {
  const p = parseBdayParam();
  if (p===true) return true;
  if (p===false) return false;
  return isBirthdayToday();
};

/* ——— Modal yardımcıları ——— */
function modalRootEnsure(){ let el=$("#modal-root"); if(!el){ el=document.createElement('div'); el.id='modal-root'; el.className='modal-overlay hidden'; el.setAttribute('aria-hidden','true'); document.body.appendChild(el);} return el; }
let modalRoot;
function openModal(html){ modalRoot.innerHTML=`<div class="modal">${html}</div>`; modalRoot.classList.remove('hidden'); modalRoot.setAttribute('aria-hidden','false'); }
function closeModal(){ modalRoot.classList.add('hidden'); modalRoot.setAttribute('aria-hidden','true'); setTimeout(()=>modalRoot.innerHTML="",200); }
function onClick(sel,fn){ const e=modalRoot.querySelector(sel); if(e) e.addEventListener('click',fn); }

/* ——— Confetti ——— */
let cctx,W,H,parts=[],rafId; const R=(a,b)=>Math.random()*(b-a)+a;
const confettiCv = document.getElementById("confetti-canvas");
function rs(){ if(!confettiCv) return; W=confettiCv.width=innerWidth; H=confettiCv.height=innerHeight; }
function make(){ const n=Math.min(90, Math.floor((W*H)/25000)); parts = Array.from({length:n}).map(()=>({x:R(0,W),y:R(-H,0),w:R(6,14),h:R(8,18),r:R(0,6.28),rv:R(-.04,.04),s:R(.8,1.6),hue:R(15,45),a:R(.65,.95)})); }
function draw(){
  cctx.clearRect(0,0,W,H);
  parts.forEach(p=>{
    p.y+=p.s; p.x+=Math.sin(p.y*.01)*.6; p.r+=p.rv;
    if(p.y-p.h>H){ p.y=-20; p.x=R(0,W); }
    cctx.save(); cctx.translate(p.x,p.y); cctx.rotate(p.r); cctx.globalAlpha=p.a;
    const g=cctx.createLinearGradient(-p.w/2,-p.h/2,p.w/2,p.h/2);
    g.addColorStop(0,`hsl(${p.hue},90%,64%)`); g.addColorStop(1,`hsl(${p.hue+12},92%,58%)`);
    cctx.fillStyle=g; cctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); cctx.restore();
  });
  rafId=requestAnimationFrame(draw);
}
function confetti(){ if(!confettiCv) return; cctx=confettiCv.getContext("2d"); rs(); make(); cancelAnimationFrame(rafId); draw(); addEventListener("resize",()=>{rs();make();}); }

/* ——— Birthday UI ——— */
function banner(){
  if ($("#bday-banner-mount") && !$("#bday-banner-mount .bday-banner")) {
    $("#bday-banner-mount").innerHTML = `<div class="bday-banner"><span class="bday-badge">🎂</span><span>Bugün Deniz’in doğum günü — iyi ki doğdun! ✨</span></div>`;
  }
}
function enableBdayUI(){
  const titleEl=$("#hero-title"); const ctaEl=$("#hero-cta");
  if (titleEl) titleEl.textContent="Bugün Deniz’in doğum günü";
  if (ctaEl){
    ctaEl.textContent="Doğum gününü kutla";
    ctaEl.href="javascript:void(0)";
    ctaEl.addEventListener('click', (e)=>{ e.preventDefault(); showNameModal(); });
  }
  banner();
}
function showNameModal(){
  openModal(`
    <div class="modal-header"><div class="modal-title">🎉 Doğum Gününü Kutlayalım</div><button class="modal-close" data-close>x</button></div>
    <div class="modal-body"><label class="muted" for="visitor-name">İsmin</label><input id="visitor-name" class="input" type="text" placeholder="Adını yaz"></div>
    <div class="modal-footer"><button class="btn outline" data-close>Vazgeç</button><button class="btn" id="next" disabled>Devam</button></div>
  `);
  const i=modalRoot.querySelector('#visitor-name'); const n=modalRoot.querySelector('#next');
  i?.addEventListener('input',()=>{ n.disabled = !(i.value.trim().length>=2); });
  onClick('[data-close]', closeModal);
  n?.addEventListener('click', ()=>{
    const name = i.value.trim();
    closeModal();
    if (looksLikeDeniz(name)) showSelfMessage(); else showNoteModal(name);
  });
}
function showSelfMessage(){
  openModal(`
    <div class="modal-header"><div class="modal-title">🫶 Minik Not</div><button class="modal-close" data-close>x</button></div>
    <div class="modal-body"><p class="muted">Minik Alevi kendi doğum gününü kutlayamazsın ama bir dilek tutmaya ne dersin? 🎂</p></div>
    <div class="modal-footer"><button class="btn outline" data-close>Sonra</button><button class="btn" id="wish">Evet</button></div>
  `);
  onClick('[data-close]', closeModal);
  onClick('#wish', ()=>{ closeModal(); showCakeModal(); });
}
function showCakeModal(){
  openModal(`
    <div class="modal-header"><div class="modal-title">🎂 Dilek Zamanı</div><button class="modal-close" data-close>x</button></div>
    <div class="modal-body">
      <div class="cake-wrap" style="display:flex;justify-content:center;margin-bottom:12px;">
        <div id="cake-static">${STATIC_CAKE}</div>
        <img id="cake-gif" src="" alt="Pasta" style="display:none;max-width:280px;border-radius:12px"/>
      </div>
      <label class="muted" for="wish-text">Dileğin</label>
      <textarea id="wish-text" class="textarea" placeholder="Kalbinden geçeni yaz..."></textarea>
    </div>
    <div class="modal-footer"><button class="btn outline" data-close>Vazgeç</button><button class="btn" id="blow">Dileği Tut</button></div>
  `);
  onClick('[data-close]', closeModal);
  onClick('#blow', ()=>{
    const stat = modalRoot.querySelector('#cake-static');
    const gif  = modalRoot.querySelector('#cake-gif');
    if (gif){ gif.src = CAKE_GIF; gif.style.display='block'; }
    if (stat){ stat.style.display='none'; }
    confetti();
    setTimeout(()=>{ 
      closeModal();
      openModal(`
        <div class="modal-header"><div class="modal-title">✨ Tamamdır!</div><button class="modal-close" data-close>x</button></div>
        <div class="modal-body"><p class="muted">Dileğin alındı. Umarım en güzel hâliyle gerçek olur! 💫</p></div>
        <div class="modal-footer"><button class="btn" data-close>Kapat</button></div>
      `);
      onClick('[data-close]', closeModal);
    }, 1200);
  });
}

/* ——— Firebase'i sadece gerektiğinde yükle ——— */
let db = null;
async function ensureDb(){
  if (db) return db;
  const [{ initializeApp }, { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp }] =
    await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js"),
    ]);

  // apiKey'i kendi değerine çevir
  const firebaseConfig = {
    apiKey: "****",
    authDomain: "denizim-art.firebaseapp.com",
    projectId: "denizim-art",
    storageBucket: "denizim-art.firebasestorage.app",
    messagingSenderId: "229660799017",
    appId: "1:229660799017:web:19586a3956821861bfac38",
    measurementId: "G-DT0NXVFKJW",
  };
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);

  // fonksiyonları global kapsama bağlıyorum (bu dosya içinde kullanılıyor)
  window.__bday__ = { collection, addDoc, getDocs, query, orderBy, serverTimestamp };
  return db;
}

const yearKey = ()=> String(new Date().getFullYear());
function colRef(){ const { collection } = window.__bday__; return collection(db,"bdayNotes",yearKey(),"notes"); }
async function addNote(name,note){
  const { addDoc, serverTimestamp } = window.__bday__;
  await addDoc(colRef(), { name:(name||"").trim(), note:(note||"").trim(), createdAt: serverTimestamp() });
}
async function fetchNotes(){
  const { getDocs, query, orderBy } = window.__bday__;
  const q = query(colRef(), orderBy("createdAt","desc"));
  const snap = await getDocs(q); const arr=[];
  snap.forEach(doc=>{ const d=doc.data(); arr.push({ name:d.name||"İsimsiz", note:d.note||"", ts:d.createdAt?.toDate? d.createdAt.toDate():null }); });
  return arr;
}

/* ——— Başlatma ——— */
document.addEventListener('DOMContentLoaded', async ()=>{
  const IS_BDAY = decideIsBday();
  if (!IS_BDAY) return;     // değilse hiçbir şey yükleme

  modalRoot = modalRootEnsure();
  enableBdayUI();           // UI değişsin (metin/cta/banner)

  // Firebase'i arkaplanda hazırla (UI'yı bekletmeden)
  try {
    await ensureDb();
    // Önceden not varsa 🎈 göster (yoksa, ilk kayıttan sonra görünecek)
    const rows = await fetchNotes();
    if (rows.length>0) ensureFab();
  } catch (e) {
    console.warn("Firebase init/Fetch hatası:", e);
  }
});
