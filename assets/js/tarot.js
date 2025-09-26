(function(){
/* ========= Görseller ========= */
const CARD_BACK_IMAGE_URL = "https://steve-p.org/cards/pix/RWSa-X-BA.png";

/* --- Deste hover ses dosyası --- */
const DECK_HOVER_SOUND_URL = "assets/sfx/deck-hover.mp3";

/* 78 kartın ön yüz linkleri */
const CARD_IMAGES = {
  "The Fool":"https://steve-p.org/cards/pix/RWSa-T-00.png",
  "The Magician":"https://steve-p.org/cards/pix/RWSa-T-01.png",
  "The High Priestess":"https://steve-p.org/cards/pix/RWSa-T-02.png",
  "The Empress":"https://steve-p.org/cards/pix/RWSa-T-03.png",
  "The Emperor":"https://steve-p.org/cards/pix/RWSa-T-04.png",
  "The Hierophant":"https://steve-p.org/cards/pix/RWSa-T-05.png",
  "The Lovers":"https://steve-p.org/cards/pix/RWSa-T-06.png",
  "The Chariot":"https://steve-p.org/cards/pix/RWSa-T-07.png",
  "Strength":"https://steve-p.org/cards/pix/RWSa-T-08.png",
  "The Hermit":"https://steve-p.org/cards/pix/RWSa-T-09.png",
  "Wheel of Fortune":"https://steve-p.org/cards/pix/RWSa-T-10.png",
  "Justice":"https://steve-p.org/cards/pix/RWSa-T-11.png",
  "The Hanged Man":"https://steve-p.org/cards/pix/RWSa-T-12.png",
  "Death":"https://steve-p.org/cards/pix/RWSa-T-13.png",
  "Temperance":"https://steve-p.org/cards/pix/RWSa-T-14.png",
  "The Devil":"https://steve-p.org/cards/pix/RWSa-T-15.png",
  "The Tower":"https://steve-p.org/cards/pix/RWSa-T-16.png",
  "The Star":"https://steve-p.org/cards/pix/RWSa-T-17.png",
  "The Moon":"https://steve-p.org/cards/pix/RWSa-T-18.png",
  "The Sun":"https://steve-p.org/cards/pix/RWSa-T-19.png",
  "Judgement":"https://steve-p.org/cards/pix/RWSa-T-20.png",
  "The World":"https://steve-p.org/cards/pix/RWSa-T-21.png",
  "Ace of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-0A.webp",
  "Two of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-02.webp",
  "Three of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-03.webp",
  "Four of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-04.webp",
  "Five of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-05.webp",
  "Six of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-06.webp",
  "Seven of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-07.webp",
  "Eight of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-08.webp",
  "Nine of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-09.webp",
  "Ten of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-10.webp",
  "Page of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-J1.webp",
  "Knight of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-J2.webp",
  "Queen of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-QU.webp",
  "King of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-KI.webp",
  "Ace of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-0A.webp",
  "Two of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-02.webp",
  "Three of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-03.webp",
  "Four of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-04.webp",
  "Five of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-05.webp",
  "Six of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-06.webp",
  "Seven of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-07.webp",
  "Eight of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-08.webp",
  "Nine of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-09.webp",
  "Ten of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-10.webp",
  "Page of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-J1.webp",
  "Knight of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-J2.webp",
  "Queen of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-QU.webp",
  "King of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-KI.webp",
  "Ace of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-0A.webp",
  "Two of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-02.webp",
  "Three of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-03.webp",
  "Four of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-04.webp",
  "Five of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-05.webp",
  "Six of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-06.webp",
  "Seven of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-07.webp",
  "Eight of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-08.webp",
  "Nine of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-09.webp",
  "Ten of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-10.webp",
  "Page of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-J1.webp",
  "Knight of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-J2.webp",
  "Queen of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-QU.webp",
  "King of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-KI.webp",
  "Ace of Pentacles":"https://steve-p.org/cards/pix/RWSa-P-0A.png",
  "Two of Pentacles":"https://steve-p.org/cards/pix/RWSa-P-02.png",
  "Three of Pentacles":"https://steve-p.org/cards/pix/RWSa-P-03.png",
  "Four of Pentacles":"https://steve-p.org/cards/pix/RWSa-P-04.png",
  "Five of Pentacles":"https://steve-p.org/cards/pix/RWSa-P-05.png",
  "Six of Pentacles":"https://steve-p.org/cards/pix/RWSa-P-06.png",
  "Seven of Pentacles":"https://steve-p.org/cards/pix/RWSa-P-07.png",
  "Eight of Pentacles":"https://steve-p.org/cards/pix/RWSa-P-08.png",
  "Nine of Pentacles":"https://steve-p.org/cards/pix/RWSa-P-09.png",
  "Ten of Pentacles":"https://steve-p.org/cards/pix/RWSa-P-10.png",
  "Page of Pentacles":"https://steve-p.org/cards/small/sm_RWSa-P-J1.webp",
  "Knight of Pentacles":"https://steve-p.org/cards/small/sm_RWSa-P-J2.webp",
  "Queen of Pentacles":"https://steve-p.org/cards/small/sm_RWSa-P-QU.webp",
  "King of Pentacles":"https://steve-p.org/cards/small/sm_RWSa-P-KI.webp"
};

/* ========= Tarot veri listeleri ========= */
const MAJOR = [
  'The Fool','The Magician','The High Priestess','The Empress','The Emperor','The Hierophant',
  'The Lovers','The Chariot','Strength','The Hermit','Wheel of Fortune','Justice','The Hanged Man',
  'Death','Temperance','The Devil','The Tower','The Star','The Moon','The Sun','Judgement','The World'
];
const SUITS = ['Wands','Cups','Swords','Pentacles'];
const RANKS = ['Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Page','Knight','Queen','King'];
const MINOR = SUITS.flatMap(suit => RANKS.map(rank => `${rank} of ${suit}`));
const ALL_CARDS = [...MAJOR, ...MINOR].map((name,idx)=>({id:idx,name}));

/* ========= Basit yorum ========= */
function lengthToSentences(len){ const l=(len||'').toLowerCase(); if(l.includes('kısa')) return [2,3]; if(l.includes('uzun')) return [7,10]; return [4,6]; }
const YESNO = { "The Sun":"yes","The Lovers":"yes","The World":"yes","The Tower":"no","Death":"no","The Devil":"no" };
function suitOf(n){ return SUITS.find(s=>n.includes(` of ${s}`)); }
function defaultYesNo(n){ return suitOf(n)==="Swords"?"no": suitOf(n)==="Cups"?"maybe":"yes"; }
function yesNoSentence(cardName){ const v=(YESNO[cardName]||defaultYesNo(cardName)); if(v==="yes")return "Enerji olumlu akıyor; doğru niyet ve net adımla 'evet' tarafı ağır basıyor."; if(v==="no")return "Evren şu an 'hayır' diyor; önce koşulları ve zamanlamayı revize et."; return "Cevap gri bölgede; kriterleri netleştirirsen lehine dönebilir."; }
function interpretCard(cardName, categoryLabel, lengthLabel, positionLabel, isYesNo){
  const [minS,maxS] = lengthToSentences(lengthLabel||"Orta");
  const want = Math.floor(Math.random()*(maxS-minS+1))+minS;
  let parts = [];
  const base = `${cardName} kartı ${categoryLabel||'Genel'} bağlamında iç denge ve netleşme ihtiyacına işaret eder. Küçük ama istikrarlı adımlar sonuç getirir.`;
  parts.push(positionLabel ? `${positionLabel}: ${base}` : base);
  if(isYesNo) parts.push( yesNoSentence(cardName) );
  while(parts.length < want) parts.push("Zamanlamayı sezgilerinle kalibre et; acele etmeden ilerlemek daha verimli.");
  return parts.slice(0,want).join(" ");
}

/* ========= Açılım pozisyonları ========= */
const positions = {
  three: ['Geçmiş','Şimdi','Gelecek'],
  five: ['Geçmiş','Şimdi','Gizli Etkiler','Engeller/Zorluklar','Gelecek'],
  cross: ['Şimdiki Durum','Engeller/Zorluklar','Bilinçli Farkındalık','Bilinçaltı/Temel','Geçmiş','Gelecek','Sen','Karşı Taraf','Umutlar/Korkular','Sonuç'],
  relationship: ['Senin Duyguların','Onun Duyguları','Senin Düşüncelerin','Onun Düşünceleri','Aranızdaki Bağ','Engeller/Sorunlar','Gelecek Olası Sonuç']
};

/* ========= State ========= */
const state = {
  name:"",
  mode:null,
  category:null,
  commentLengthLabel:"Orta",
  yesnoQuestion:"",
  decksMeta:null,
  chosenDeckIndex:null,
  needSelect:0,
  selectedCards:[],

  // ses state
  audioUnlocked:false,
  lastDeckHoverAt:0
};

/* ========= Ses Yardımcıları ========= */
const deckHoverAudio = new Audio();
deckHoverAudio.src = DECK_HOVER_SOUND_URL;
deckHoverAudio.preload = "auto";
deckHoverAudio.volume = 0.35;

function unlockAudioOnce(){
  if(state.audioUnlocked) return;
  deckHoverAudio.muted = true;
  deckHoverAudio.play().then(()=>{
    deckHoverAudio.pause();
    deckHoverAudio.currentTime = 0;
    deckHoverAudio.muted = false;
    state.audioUnlocked = true;
  }).catch(()=>{ /* sessizce geç */ });
}

function playDeckHover(){
  const now = performance.now();
  if(now - state.lastDeckHoverAt < 800) return; // throttle
  state.lastDeckHoverAt = now;

  try{
    deckHoverAudio.currentTime = 0;
    deckHoverAudio.play().catch(()=>{ /* autoplay engeli varsa sessizce geç */ });
  }catch(_){}
}

/* ========= Render ========= */
const root = document.getElementById('tarot-app');
render();

function render(){
  if(state.selectedCards.length && state.selectedCards.length===state.needSelect){
    return renderFinal();
  }

  root.innerHTML = `
    <h2>🔮 Online Tarot</h2>
    <div class="muted">İsmini, açılımı ve <b>yorum boyutunu</b> seç. Tek Kart’ta evet/hayır sorunu yaz.</div>

    <div class="section">
      <div class="row row-2">
        <div>
          <label class="muted">İsmin</label>
          <input id="inp-name" type="text" placeholder="İsmini yaz" value="${escapeHtml(state.name)}">
        </div>
        <div>
          <label class="muted">Açılım Türü</label>
          <select id="sel-mode">
            <option value="">Seçiniz...</option>
            <option value="one" ${state.mode==='one'?'selected':''}>Tek Kart</option>
            <option value="three" ${state.mode==='three'?'selected':''}>3 Kart</option>
            <option value="five" ${state.mode==='five'?'selected':''}>5 Kart</option>
            <option value="cross" ${state.mode==='cross'?'selected':''}>Haç Açılımı</option>
            <option value="relationship" ${state.mode==='relationship'?'selected':''}>İlişki Açılımı</option>
          </select>
        </div>
        <div>
          <label class="muted">Yorum Boyutu</label>
          <select id="sel-len">
            <option ${state.commentLengthLabel==='Kısa'?'selected':''}>Kısa</option>
            <option ${state.commentLengthLabel==='Orta'?'selected':''}>Orta</option>
            <option ${state.commentLengthLabel==='Uzun'?'selected':''}>Uzun</option>
          </select>
        </div>
      </div>
    </div>
  `;

  if(state.mode === 'one'){
    root.insertAdjacentHTML('beforeend', `
      <div class="section">
        <label class="muted">Evet / Hayır Sorun</label>
        <textarea id="inp-yn" placeholder="Örn: Bugünkü görüşmem olumlu geçer mi?">${escapeHtml(state.yesnoQuestion)}</textarea>
      </div>
    `);
  } else if(state.mode){
    root.insertAdjacentHTML('beforeend', `
      <div class="section">
        <label class="muted">Kategori</label>
        <select id="sel-cat">
          <option value="">Seçiniz…</option>
          <option value="Aşk" ${state.category==='Aşk'?'selected':''}>Aşk</option>
          <option value="Kariyer/Para" ${state.category==='Kariyer/Para'?'selected':''}>Kariyer/Para</option>
          <option value="Genel Durum" ${state.category==='Genel Durum'?'selected':''}>Genel Durum</option>
        </select>
      </div>
    `);
  }

  root.insertAdjacentHTML('beforeend', `
    <div class="section">
      <button id="btn-decks" class="btn">Desteleri Oluştur</button>
      ${state.decksMeta ? '<span class="pill" style="margin-left:8px;">Hazır</span>':''}
      <div id="form-hint" class="muted" style="margin-top:8px;"></div>
    </div>
  `);

  if(state.decksMeta){
    if(state.chosenDeckIndex === null){
      // === GERÇEKÇİ DESTE GÖRÜNÜMÜ ===
      const wrap = document.createElement('div'); 
      wrap.className='section';
      wrap.innerHTML = `<div class="decks" id="decks"></div>`;
      const decksEl = wrap.querySelector('#decks');

      state.decksMeta.decks.forEach((deck,i)=>{
        const stackImgs = Array.from({length:5}).map(()=>`<img src="${CARD_BACK_IMAGE_URL}" alt="Deck">`).join('');
        decksEl.insertAdjacentHTML('beforeend', `
          <button class="deck deck-btn" data-i="${i}" type="button" aria-label="Deste ${i+1}">
            <div class="deck-stack">${stackImgs}</div>
            <div class="deck-meta">
              <div class="deck-title">Deste ${i+1}</div>
              <div class="muted">${deck.length} kart</div>
            </div>
          </button>
        `);
      });

      // >>> HER BUTONA DOĞRUDAN HOVER/LONG-PRESS SESİ EKLE <<<
      decksEl.querySelectorAll('.deck-btn').forEach(btn=>{
        btn.addEventListener('mouseenter', playDeckHover, {passive:true});
        // dokunmatik için
        btn.addEventListener('touchstart', playDeckHover, {passive:true});
      });

      // Seçim
      decksEl.addEventListener('click', (e)=>{
        const btn = e.target.closest('.deck-btn');
        if(!btn) return;
        const i = parseInt(btn.dataset.i,10);
        state.chosenDeckIndex = i;
        state.needSelect = requiredCount(state.mode);
        state.selectedCards = [];
        render();
      });

      root.appendChild(wrap);
    }else{
      const deck = state.decksMeta.decks[state.chosenDeckIndex];
      const picked = state.selectedCards.length;
      const wrap = document.createElement('div'); wrap.className='section';
      wrap.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <span class="pill">Deste ${state.chosenDeckIndex+1}</span>
          <span class="muted">Seçilecek: <b>${state.needSelect}</b> • Seçilen: <b>${picked}</b></span>
          <div style="flex:1"></div>
          <button id="btn-change-deck" class="btn" style="background:#555;color:#fff">Desteyi Değiştir</button>
        </div>
        <div class="cards" id="cards-grid"></div>
      `;
      root.appendChild(wrap);

      const grid = wrap.querySelector('#cards-grid');
      deck.forEach(cardId=>{
        const cardData = ALL_CARDS[cardId];
        const el = document.createElement('div');
        el.className = 'card';
        el.innerHTML = `
          <div class="card-inner">
            <div class="back"><img alt="back" src="${CARD_BACK_IMAGE_URL}"></div>
            <div class="face"><img alt="${escapeHtml(cardData.name)}" src="${CARD_IMAGES[cardData.name]||''}"></div>
          </div>
        `;
        el.addEventListener('click', ()=>{
          if(el.classList.contains('flipped')) return;
          if(state.selectedCards.length >= state.needSelect) return;
          el.classList.add('flipped','show-front');
          el.insertAdjacentHTML('beforeend', `<div class="sel-badge">#${state.selectedCards.length+1}</div>`);
          state.selectedCards.push({ id: cardId, name: cardData.name, img: CARD_IMAGES[cardData.name]||'' });
          if(state.selectedCards.length === state.needSelect){
            setTimeout(()=>render(), 600);
          }
        });
        grid.appendChild(el);
      });

      wrap.querySelector('#btn-change-deck').addEventListener('click', ()=>{
        state.chosenDeckIndex = null;
        state.selectedCards = [];
        render();
      });
    }
  }

  bindInputs();
}

/* ========= Final ekran ========= */
function renderFinal(){
  const lenLabel = state.commentLengthLabel || "Orta";
  root.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
      <span class="pill">${escapeHtml(state.name)}</span>
      <span class="pill">${label(state.mode)}</span>
      ${state.mode!=='one' ? `<span class="pill">${escapeHtml(state.category||'—')}</span>`:''}
      <span class="pill">${escapeHtml(lenLabel)}</span>
      <div style="flex:1"></div>
      <button id="btn-retry" class="btn dark">Yeniden Dene</button>
    </div>

    <div class="final-grid" id="final-grid"></div>
    <div class="reading"><h3>🧿 Yorum</h3><div id="reading-body"></div></div>
  `;

  const gallery = document.getElementById('final-grid');
  state.selectedCards.forEach((c,i)=>{
    gallery.insertAdjacentHTML('beforeend', `
      <div class="final-card">
        <div class="img"><img src="${c.img}" alt="${escapeHtml(c.name)}"></div>
        <div class="cap">#${i+1} • ${escapeHtml(c.name)}</div>
      </div>
    `);
  });

  const body = document.getElementById('reading-body');
  if(state.mode==='one'){
    const c = state.selectedCards[0];
    const txt = interpretCard(c.name, "Genel Durum", lenLabel, null, true);
    body.insertAdjacentHTML('beforeend', `
      <div class="meta">Soru: <b>${escapeHtml(state.yesnoQuestion||'—')}</b></div>
      <div class="item">${escapeHtml(txt)}</div>
    `);
  }else{
    const pos = positions[state.mode] || [];
    state.selectedCards.forEach((c,i)=>{
      const posLabel = pos[i]||('Kart '+(i+1));
      const txt = interpretCard(c.name, state.category || "Genel Durum", lenLabel, posLabel, false);
      body.insertAdjacentHTML('beforeend', `
        <div class="item">
          <div class="meta">${escapeHtml(posLabel)} • Kart: <b>${escapeHtml(c.name)}</b></div>
          ${escapeHtml(txt)}
        </div>
      `);
    });
  }

  document.getElementById('btn-retry').addEventListener('click', ()=>{ resetAll(); render(); });
}

/* ========= Inputs & doğrulama ========= */
function bindInputs(){
  const nameEl = document.getElementById('inp-name');
  const modeEl = document.getElementById('sel-mode');
  const lenEl  = document.getElementById('sel-len');
  const catEl  = document.getElementById('sel-cat');
  const ynEl   = document.getElementById('inp-yn');
  const decksBtn = document.getElementById('btn-decks');

  if(nameEl) nameEl.addEventListener('input', e=>{ state.name = e.target.value.trim(); });
  if(modeEl) modeEl.addEventListener('change', e=>{
    state.mode = e.target.value || null;
    state.category = null; state.decksMeta=null; state.chosenDeckIndex=null; state.selectedCards=[]; state.needSelect=0; state.yesnoQuestion='';
    render();
  });
  if(lenEl) lenEl.addEventListener('change', e=>{ state.commentLengthLabel = e.target.value; });
  if(catEl) catEl.addEventListener('change', e=>{ state.category = e.target.value || null; });
  if(ynEl) ynEl.addEventListener('input', e=>{ state.yesnoQuestion = e.target.value; });

  if(decksBtn) decksBtn.addEventListener('click', ()=>{
    unlockAudioOnce(); // ilk etkileşimde sesi unlock et
    const hint = document.getElementById('form-hint');
    const nameInput = document.getElementById('inp-name');
    const modeInput = document.getElementById('sel-mode');
    const catInput  = document.getElementById('sel-cat');

    clearError(nameInput); clearError(modeInput); if(catInput) clearError(catInput);
    hint.textContent = "";

    if(!state.name){ setError(nameInput); hint.textContent = "Lütfen ismini yaz."; nameInput?.focus(); return; }
    if(!state.mode){ setError(modeInput); hint.textContent = "Lütfen açılım türünü seç."; modeInput?.focus(); return; }
    if(state.mode!=='one' && !state.category){
      setError(catInput); hint.textContent = "Bu açılım için kategori (Aşk / Kariyer-Para / Genel) seçmelisin."; catInput?.focus(); return;
    }

    state.decksMeta = buildDecks(state.mode);
    state.chosenDeckIndex = null; state.selectedCards=[]; state.needSelect = requiredCount(state.mode);
    render();
  });

  function setError(el){ if(!el) return; el.classList.add('field-error'); el.scrollIntoView({behavior:'smooth', block:'center'}); }
  function clearError(el){ if(!el) return; el.classList.remove('field-error'); }
}

/* ========= Helpers ========= */
function buildDecks(mode){
  const shuffled = shuffle(ALL_CARDS.map(c=>c.id));
  let decksCount = 6, size = 13;
  if(mode==='cross'){ decksCount = 3; size = 26; }
  const decks = []; let i=0;
  for(let d=0; d<decksCount; d++){ decks.push(shuffled.slice(i, i+size)); i+=size; }
  return {count:decksCount, size, decks};
}
function requiredCount(m){ return m==='one'?1: m==='three'?3: m==='five'?5: m==='cross'?10: m==='relationship'?7:1; }
function label(m){ return m==='one'?'Tek Kart': m==='three'?'3 Kart': m==='five'?'5 Kart': m==='cross'?'Haç Açılımı':'İlişki Açılımı'; }
function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function escapeHtml(s=''){ return s.replace(/[&<>"']/g, ch=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[ch])); }
function resetAll(){ state.name=''; state.mode=null; state.category=null; state.commentLengthLabel='Orta'; state.yesnoQuestion=''; state.decksMeta=null; state.chosenDeckIndex=null; state.selectedCards=[]; state.needSelect=0; }

})();
