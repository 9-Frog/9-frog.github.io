(() => {
  'use strict';
  const studies = window.VISORA_SHOWCASE;
  const section = document.querySelector('#possibilities');
  const track = section.querySelector('#showcase-track');
  const chips = section.querySelector('.showcase-industries');
  const previous = section.querySelector('[data-carousel="previous"]');
  const next = section.querySelector('[data-carousel="next"]');
  const counter = section.querySelector('#showcase-counter');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const escape = value => String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const two = value => String(value).padStart(2,'0');
  let activeIndex = 0;
  let selected = 0;
  let opener;
  let scrollTimer;

  track.innerHTML = studies.map((item,i)=>`<button type="button" class="study-card study-${item.theme} study-layout-${item.layout}" data-study="${i}" aria-label="Explore ${escape(item.industry)} concept — ${escape(item.brand)}" style="--study-bg:${item.bg};--study-ink:${item.ink};--study-accent:${item.accent}">
    <span class="study-art"><img src="${item.image.replace('.webp','.thumb.webp')}" alt="${escape(item.alt)}" width="1536" height="1024" loading="lazy" decoding="async"><span class="study-top"><span class="study-brand">${escape(item.brand)}</span><span class="study-mini-nav">${escape(item.tabs[1])} &nbsp; ${escape(item.tabs[2])} &nbsp; ↗</span></span><span class="study-copy"><span class="study-eyebrow">${escape(item.subbrand)}</span><strong>${escape(item.headline[0])}<br><em>${escape(item.headline[1])}</em></strong><span class="study-cta">${escape(item.action)} <span aria-hidden="true">↗</span></span></span><span class="study-open" aria-hidden="true">Explore website ↗</span></span>
    <span class="study-caption"><span><span class="study-number">${two(i+1)} /</span><strong>${escape(item.industry)}</strong></span><span>5 pages to explore <span aria-hidden="true">↗</span></span></span>
  </button>`).join('');
  chips.innerHTML=studies.map((item,i)=>`<button type="button" data-jump="${i}" aria-controls="showcase-track" aria-pressed="false">${escape(item.industry)}</button>`).join('');
  const cards = [...track.querySelectorAll('.study-card')];
  const visibleCount = () => matchMedia('(max-width: 760px)').matches ? 1 : 2;
  const stride = () => cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);

  function reflectPosition() {
    const count=visibleCount();
    activeIndex=Math.max(0,Math.min(studies.length-count,Math.round(track.scrollLeft/stride())));
    previous.disabled=activeIndex===0;
    next.disabled=activeIndex>=studies.length-count;
    counter.textContent=`${two(activeIndex+1)}${count>1?' — '+two(Math.min(activeIndex+count,studies.length)):''} / ${two(studies.length)}`;
    chips.querySelectorAll('button').forEach((button,i)=>button.setAttribute('aria-pressed',String(i>=activeIndex&&i<activeIndex+count)));
    const chip=chips.children[activeIndex];
    chips.scrollTo({left:chip.offsetLeft-chips.offsetLeft-20,behavior:motion.matches?'instant':'smooth'});
  }
  function goTo(index) {
    const count=visibleCount();
    activeIndex=Math.max(0,Math.min(index,studies.length-count));
    track.scrollTo({left:activeIndex*stride(),behavior:motion.matches?'instant':'smooth'});
  }
  previous.addEventListener('click',()=>goTo(activeIndex-visibleCount()));
  next.addEventListener('click',()=>goTo(activeIndex+visibleCount()));
  chips.addEventListener('click',event=>{const button=event.target.closest('[data-jump]');if(button)goTo(Number(button.dataset.jump));});
  track.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(reflectPosition,100);},{passive:true});
  track.addEventListener('keydown',event=>{
    if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
    event.preventDefault();
    const focusedCard=cards.indexOf(document.activeElement);
    const origin=focusedCard<0?activeIndex:focusedCard;
    const destination=event.key==='Home'?0:event.key==='End'?studies.length-1:Math.max(0,Math.min(studies.length-1,origin+(event.key==='ArrowRight'?1:-1)));
    if(focusedCard>=0)cards[destination].focus({preventScroll:true});
    goTo(destination);
  });
  new ResizeObserver(()=>{
    track.scrollTo({left:Math.min(activeIndex,studies.length-visibleCount())*stride(),behavior:'instant'});
    reflectPosition();
  }).observe(track);

  const dialog=document.querySelector('#showcase-dialog');
  const frame=dialog.querySelector('#showcase-frame');
  const selector=dialog.querySelector('#showcase-select');
  const stage=dialog.querySelector('.showcase-stage');
  const loading=dialog.querySelector('.showcase-loading');
  selector.innerHTML=studies.map((item,i)=>`<option value="${i}">${two(i+1)} / ${escape(item.industry)}</option>`).join('');

  function displayStudy(index) {
    selected=(index+studies.length)%studies.length;
    const item=studies[selected];
    selector.value=String(selected);
    dialog.querySelector('#showcase-title').textContent=item.brand;
    dialog.querySelector('.showcase-address').textContent=`${item.brand.toLowerCase()} / design study`;
    dialog.querySelector('.showcase-preview-count').textContent=`${two(selected+1)} / ${two(studies.length)}`;
    frame.title=`${item.brand}: interactive ${item.industry} website preview`;
    frame.setAttribute('aria-busy','true');
    loading.hidden=false;
    frame.src=`preview.html?concept=${encodeURIComponent(item.id)}`;
  }
  function openStudy(index, trigger) {
    opener=trigger;
    displayStudy(index);
    document.body.classList.add('showcase-is-open');
    dialog.showModal();
    dialog.querySelector('.showcase-close').focus();
  }
  function closeStudy() {dialog.close();}
  function chooseStudy() {
    const item=studies[selected];
    const message=document.querySelector('#project-form textarea[name="message"]');
    const sentence=`I liked the ${item.brand} (${item.industry}) design direction. I'd like to explore a custom website for my business.`;
    // Keep any brief the visitor has already started.
    if(!message.value.includes(sentence)) message.value=(message.value.trim()?message.value.trim()+'\n\n':'')+sentence;
    if(message.value.length>message.maxLength) message.value=message.value.slice(0,message.maxLength);
    opener=null;
    closeStudy();
    location.hash='start';
    document.querySelector('#start').scrollIntoView({behavior:motion.matches?'instant':'smooth',block:'start'});
    message.focus({preventScroll:true});
  }
  track.addEventListener('click',event=>{const button=event.target.closest('[data-study]');if(button)openStudy(Number(button.dataset.study),button);});
  selector.addEventListener('change',()=>displayStudy(Number(selector.value)));
  dialog.querySelector('[data-study-step="previous"]').addEventListener('click',()=>displayStudy(selected-1));
  dialog.querySelector('[data-study-step="next"]').addEventListener('click',()=>displayStudy(selected+1));
  dialog.querySelector('.showcase-close').addEventListener('click',closeStudy);
  dialog.querySelector('.showcase-use').addEventListener('click',chooseStudy);
  dialog.querySelectorAll('[data-device]').forEach(button=>button.addEventListener('click',()=>{
    stage.classList.toggle('is-mobile',button.dataset.device==='mobile');
    dialog.querySelectorAll('[data-device]').forEach(control=>control.setAttribute('aria-pressed',String(control===button)));
  }));
  frame.addEventListener('load',()=>{loading.hidden=true;frame.setAttribute('aria-busy','false');});
  dialog.addEventListener('close',()=>{
    document.body.classList.remove('showcase-is-open');
    frame.removeAttribute('src');
    if(opener?.isConnected) opener.focus({preventScroll:true});
  });
  dialog.addEventListener('click',event=>{
    if(event.target===dialog) {
      const bounds=dialog.getBoundingClientRect();
      if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)closeStudy();
    }
  });
  addEventListener('message',event=>{
    // The sandbox has an opaque origin, so verify the exact sending window.
    if(!dialog.open||event.source!==frame.contentWindow||!event.data||typeof event.data!=='object')return;
    if(event.data.type==='visora-close-concept')closeStudy();
    if(event.data.type==='visora-choose-concept'&&event.data.id===studies[selected].id)chooseStudy();
  });
  reflectPosition();
})();
