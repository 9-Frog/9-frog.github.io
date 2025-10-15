// Birthday — 16 Ekim (veya ?bday=1/true/yes/on) aktif,
// Firestore'a not kaydı + şifreyle görüntüleme.
// Bu sürüm DOMContentLoaded bekler ve gate açık olsa bile
// açıldıktan sonra da çalışır (id'leri bulamazsa sessizce devam eder).

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs,
  query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

/* ——— Firebase config: apiKey'i kendi anahtarınla değiştir ——— */
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDU2nvSfCdcQIxhKg3QTjydr9_kfSomiZg",
  authDomain: "denizim-art.firebaseapp.com",
  projectId: "denizim-art",
  storageBucket: "denizim-art.firebasestorage.app",
  messagingSenderId: "229660799017",
  appId: "1:229660799017:web:19586a3956821861bfac38",
  measurementId: "G-DT0NXVFKJW"

};
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

/* ——— Yardımcılar ——— */
const $    = s => document.querySelector(s);
const esc  = (s='') => s.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const norm = s => (s||"").toLowerCase().replace(/ı/g,"i").replace(/[^\p{L}\p{N}]+/gu,"");
function lev(a,b){const m=a.length,n=b.length,dp=Array.from({length:m+1},()=>Array(n+1).fill(0));for(let i=0;i<=m;i++)dp[i][0]=i;for(let j=0;j<=n;j++)dp[0][j]=j;for(let i=1;i<=m;i++){for(let j=1;j<=n;j++){const c=a[i-1]===b[j-1]?0:1;dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+c)}}return dp[m][n]}
const looksLikeDeniz = name => { const n=norm(name); if(!n) return false; if(["deniz","denizim","denize","denizi"].includes(n)) return true; return lev(n,"deniz")<=1; };

const CAKE_GIF = "https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUya25qYWltdDJndThoZDlnM3kyMzZ6bGg2YzY5MGU2bjgyMm83N3RxNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7NpSWoebkmJuryOWOG/giphy.gif";
const STATIC_CAKE = `<svg viewBox="0 0 120 90" width="180" aria-hidden="true"><defs><linearGradient id="g1" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffd9d6"/><stop offset="1" stop-color="#ffcab5"/></linearGradient></defs><g fill="none" stroke="none"><rect x="10" y="48" width="100" height="28" rx="6" fill="url(#g1)"/><rect x="22" y="36" width="76" height="16" rx="5" fill="#fff1f4"/><circle cx="40" cy="36" r="3" fill="#ff9eb3"/><circle cx="60" cy="36" r="3" fill="#ffa94d"/><circle cx="80" cy="36" r="3" fill="#74c0fc"/><rect x="34" y="22" width="4" height="10" rx="2" fill="#8d6e63"/><rect x="58" y="22" width="4" height="10" rx="2" fill="#8d6e63"/><rect x="82" y="22" width="4" height="10" rx="2" fill="#8d6e63"/><path d="M36 20c1-2 4-2 5 0" stroke="#ffcc00" stroke-width="2" stroke-linecap="round"/><path d="M60 20c1-2 4-2 5 0" stroke="#ffcc00" stroke-width="2" stroke-linecap="round"/><path d="M84 20c1-2 4-2 5 0" stroke="#ffcc00" stroke-width="2" stroke-linecap="round"/></g></svg>`;

/* ——— URL parametresi ve tarih kontrolleri ——— */
function parseBdayParam(){
  const params = new URLSearchParams(location.search);
  const raw = (params.get('bday') || '').toLowerCase().trim();
  if (!raw) return null; // parametre yok
  const ON  = new Set(['1','true','yes','on']);
  const OFF = new Set(['0','false','no','off']);
  if (ON.has(raw))  return true;
  if (OFF.has(raw)) return false;
  return null;
}
function isBirthdayToday(){
  const now = new Date();
  return now.getMonth()===9 && now.getDate()===16; // 16 Ekim
}
const decideIsBday = () => {
  const p = parseBdayParam();
  if (p === true)  return true;
  if (p === false) return false;
  return isBirthdayToday();
};

/* ——— Firestore yardımcıları ——— */
const yearKey = ()=> String(new Date().getFullYear());
const colRef  = ()=> collection(db,"bdayNotes",yearKey(),"notes");
async function addNote(name,note){ await addDoc(colRef(),{name:(name||"").trim(), note:(note||"").trim(), createdAt:serverTimestamp()}); }
async function fetchNotes(){
  const q=query(colRef(), orderBy("createdAt","desc"));
  const snap=await getDocs(q); const arr=[]; snap.forEach(doc=>{ const d=doc.data(); arr.push({ name:d.name||"İsimsiz", note:d.note||"", ts:d.createdAt?.toDate? d.createdAt.toDate():null }); });
  return arr;
}
const tsTR = d => { try{ return d?.toLocaleString('tr-TR',{dateStyle:'medium', timeStyle:'short'});}catch{return '';} };

/* ——— Modal yardımcıları ——— */
function modalRootEnsure(){ let el=$("#modal-root"); if(!el){ el=document.createElement('div'); el.id='modal-root'; el.className='modal-overlay hidden'; el.setAttribute('aria-hidden','true'); document.body.appendChild(el);} return el; }
let modalRoot;
function openModal(html){ modalRoot.innerHTML=`<div class="modal">${html}</div>`; modalRoot.classList.remove('hidden'); modalRoot.setAttribute('aria-hidden','false'); }
function closeModal(){ modalRoot.classList.add('hidden'); modalRoot.setAttribute('aria-hidden','true'); setTimeout(()=>modalRoot.innerHTML="",200); }
function onClick(sel,fn){ const e=modalRoot.querySelector(sel); if(e) e.addEventListener('click',fn); }

/* ——— FAB (🎈) ——— */
function ensureFab(){
  if($("#bday-view-btn")) return;
  const b=document.createElement('button'); b.id="bday-view-btn"; b.className="fab"; b.title="Doğum gününü kutlayanları gör"; b.innerHTML="🎈";
  document.body.appendChild(b);
  b.addEventListener('click', askPwdThenShow);
}
function askPwdThenShow(){
  openModal(`
    <div class="modal-header"><div class="modal-title">🔒 Listeyi Gör</div><button class="modal-close" data-close>x</button></div>
    <div class="modal-body"><label class="muted" for="pwd">Şifre</label><input id="pwd" class="input" type="password" placeholder="Şifre"></div>
    <div class="modal-footer"><button class="btn outline" data-close>İptal</button><button class="btn" id="ok">Devam</button></div>
  `);
  onClick('[data-close]', closeModal);
  onClick('#ok', async ()=>{
    const v=(modalRoot.querySelector('#pwd')?.value||'').trim();
    if(v==="24062025"){ closeModal(); showViewer(); }
    else { const i=modalRoot.querySelector('#pwd'); if(i){ i.value=""; i.focus(); } }
  });
}
async function showViewer(){
  const rows=await fetchNotes(), y=yearKey();
  const html = rows.length ? rows.map((r,i)=>`
    <div class="note-item">
      <div class="note-meta">#${i+1} • ${tsTR(r.ts)||''}</div>
      <div class="note-name"><b>${esc(r.name)}</b></div>
      <div class="note-text">${esc(r.note)}</div>
    </div>`).join('') : `<div class="muted">Bugün için kayıtlı bir not yok.</div>`;
  openModal(`
    <div class="modal-header"><div class="modal-title">📒 ${y} — Bugünün Notları</div><button class="modal-close" data-close>x</button></div>
    <div class="modal-body">${html}</div>
    <div class="modal-footer"><button class="btn" data-close>Kapat</button></div>
  `);
  onClick('[data-close]', closeModal);
}

/* ——— Doğum günü akışı ——— */
function banner(){
  if ($("#bday-banner-mount") && !$("#bday-banner-mount .bday-banner")) {
    $("#bday-banner-mount").innerHTML = `<div class="bday-banner"><span class="bday-badge">🎂</span><span>Bugün Deniz’in doğum günü — iyi ki doğdun! ✨</span></div>`;
  }
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
    }, 1500);
  });
}
function showNoteModal(visitorName){
  openModal(`
    <div class="modal-header"><div class="modal-title">📝 Deniz’e Bir Not Bırak</div><button class="modal-close" data-close>x</button></div>
    <div class="modal-body"><label class="muted" for="note-text">Mesajın</label><textarea id="note-text" class="textarea" placeholder="Deniz’e doğum günü mesajın..."></textarea></div>
    <div class="modal-footer"><button class="btn outline" data-close>Vazgeç</button><button class="btn" id="send">Gönder</button></div>
  `);
  onClick('[data-close]', closeModal);
  onClick('#send', async ()=>{
    const ta = modalRoot.querySelector('#note-text');
    const txt = (ta?.value || '').trim();
    if (!txt){ ta?.focus(); return; }
    await addNote(visitorName, txt);
    ensureFab();
    confetti();
    closeModal();
    openModal(`
      <div class="modal-header"><div class="modal-title">🎉 Teşekkürler!</div><button class="modal-close" data-close>x</button></div>
      <div class="modal-body"><p class="muted">Notun kaydedildi. Bugünün anısına harika bir iz bıraktın! 💖</p></div>
      <div class="modal-footer"><button class="btn" data-close>Kapat</button></div>
    `);
    onClick('[data-close]', closeModal);
  });
}

/* ——— Confetti ——— */
let cctx,W,H,parts=[],rafId; const R=(a,b)=>Math.random()*(b-a)+a;
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

/* ——— Uygula ——— */
function enableBdayUI(){
  // hero başlık/cta varsa güncelle
  const titleEl = $("#hero-title");
  const ctaEl   = $("#hero-cta");
  if (titleEl) titleEl.textContent = "Bugün Deniz’in doğum günü";
  if (ctaEl){
    ctaEl.textContent = "Doğum gününü kutla";
    ctaEl.href = "javascript:void(0)";
    ctaEl.addEventListener('click', (e)=>{ e.preventDefault(); showNameModal(); });
  }
  // banner mount varsa banner bas
  if ($("#bday-banner-mount")){
    if (!$("#bday-banner-mount .bday-banner")){
      $("#bday-banner-mount").innerHTML = `<div class="bday-banner"><span class="bday-badge">🎂</span><span>Bugün Deniz’in doğum günü — iyi ki doğdun! ✨</span></div>`;
    }
  }
}

/* ——— Başlatma: DOMContentLoaded sonrası ——— */
document.addEventListener('DOMContentLoaded', async ()=>{
  modalRoot = modalRootEnsure();

  const IS_BDAY = decideIsBday();
  if (!IS_BDAY) return;           // bugünün modu değilse hiç dokunma

  // not varsa 🎈 göster; yoksa not bırakılınca gösterilecek
  try { const rows = await fetchNotes(); if (rows.length>0) ensureFab(); } catch {}

  // gate açıkken bile UI hazırlansın: gate kalkınca zaten görünür olacak
  enableBdayUI();
});
