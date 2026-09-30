(() => {
  'use strict';
  const concepts = window.VISORA_SHOWCASE;
  const params = new URLSearchParams(location.search);
  const concept = concepts.find(item => item.id === params.get('concept')) || concepts[0];
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const pages = ['home', 'services', 'about', 'gallery', 'contact'];
  const arrow = '<span aria-hidden="true">↗</span>';
  const image = (className = '', loading = 'lazy') => `<img class="${className}" src="${concept.image}" alt="${escape(concept.alt)}" width="1536" height="1024" loading="${loading}">`;
  const link = (page, label, className = 'text-link') => `<a class="${className}" href="#${page}">${escape(label)} ${arrow}</a>`;
  const brand = `<span class="brand-name">${escape(concept.brand)}</span><span class="brand-sub">${escape(concept.subbrand)}</span>`;
  let serviceChoice = '';
  let pageId;
  document.title = `${concept.brand} — ${concept.industry} | VISORA design study`;
  document.body.className = `theme-${concept.theme} layout-${concept.layout}`;
  Object.entries({'--accent':concept.accent, '--paper':concept.bg, '--ink':concept.ink}).forEach(([key,value]) => document.documentElement.style.setProperty(key,value));

  document.querySelector('#concept-site').innerHTML = `
    <header class="site-top">
      <a href="#home" class="wordmark" aria-label="${escape(concept.brand)} home">${brand}</a>
      <button class="nav-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="concept-nav"><span></span><span></span></button>
      <nav id="concept-nav" aria-label="${escape(concept.brand)} navigation">${pages.map((page,i)=>`<a href="#${page}"${i===4?' class="nav-contact"':''}>${escape(concept.tabs[i])}${i===4?' '+arrow:''}</a>`).join('')}</nav>
    </header>
    <main id="page" tabindex="-1"></main>
    <footer class="concept-footer"><a href="#home" class="wordmark">${brand}</a><div class="footer-links">${link('services',concept.tabs[1])}${link('contact',concept.tabs[4])}</div><p>A fictional design study by VISORA.<br>Explore the design. Imagine your business here.</p></footer>
    <div class="concept-note"><span>DESIGN STUDY / ${escape(concept.industry.toUpperCase())}</span><button type="button" id="choose-design">Make this direction yours ${arrow}</button></div>`;

  function servicesList(limit = 4) {
    return `<div class="service-list">${concept.services.slice(0,limit).map(([name,description,meta],i)=>`<a href="#contact" class="service-row" data-service="${escape(name)}"><span class="row-number">0${i+1}</span><div><h3>${escape(name)}</h3><p>${escape(description)}</p></div><span class="service-meta">${escape(meta)}</span><span class="service-arrow" aria-hidden="true">↗</span></a>`).join('')}</div>`;
  }
  function smallIntro(label, title, copy) {
    return `<div class="page-intro"><p class="eyebrow">${escape(label)}</p><h1>${escape(title)}</h1>${copy?`<p class="intro-copy">${escape(copy)}</p>`:''}</div>`;
  }
  function homePage() {
    return `<section class="home-hero">
      <div class="hero-visual">${image('', 'eager')}<span class="image-stamp">${escape(concept.subbrand)}</span></div>
      <div class="hero-copy"><p class="eyebrow">${escape(concept.eyebrow)}</p><h1>${escape(concept.headline[0])}<br><em>${escape(concept.headline[1])}</em></h1><p class="hero-description">${escape(concept.description)}</p>${link('services',concept.action,'solid-link')}</div>
      <div class="hero-bottom"><span>THOUGHTFUL FROM THE FIRST HELLO.</span>${link('about','A little about us')}</div>
    </section>
    <section class="home-intro content-width"><span class="section-index">01 / ${escape(concept.tabs[2].toUpperCase())}</span><div><h2>${escape(concept.aboutTitle)}</h2><p>${escape(concept.about[0])}</p>${link('about',concept.tabs[2])}</div><span class="decorative-mark" aria-hidden="true">${['electrical','plumbing','gas'].includes(concept.id)?'↗':'✳'}</span></section>
    <section class="home-services content-width"><div class="section-title"><div><p class="eyebrow">02 / ${escape(concept.tabs[1].toUpperCase())}</p><h2>${escape(concept.serviceTitle)}</h2></div>${link('services','Explore the full selection')}</div>${servicesList(3)}</section>
    <section class="wide-callout">${image()}<div><p class="eyebrow">THERE’S MORE TO EXPLORE.</p><h2>${escape(concept.galleryTitle)}</h2>${link('gallery',concept.tabs[3],'solid-link')}</div></section>`;
  }
  function servicesPage() {
    return `<section class="content-width inner-page services-page">${smallIntro(`01 / ${concept.tabs[1]}`,concept.serviceTitle,concept.serviceIntro)}<div class="services-layout"><div>${servicesList()}<p class="small-note">Illustrative services for this concept website. Select an option to try the enquiry experience.</p></div><div class="services-photo">${image('', 'eager')}<span>${escape(concept.brand)}<small>${escape(concept.subbrand)}</small></span></div></div></section>`;
  }
  function aboutPage() {
    return `<section class="content-width inner-page about-page">${smallIntro(`02 / ${concept.tabs[2]}`,concept.aboutTitle)}<div class="about-layout"><figure>${image('', 'eager')}<figcaption>${escape(concept.subbrand)} / THE DETAILS MATTER.</figcaption></figure><div class="about-story"><p class="lead">${escape(concept.about[0])}</p><p>${escape(concept.about[1])}</p><div class="values">${concept.values.map((value,i)=>`<div><span>0${i+1}</span><h3>${escape(value)}</h3></div>`).join('')}</div>${link('contact',concept.tabs[4],'solid-link')}</div></div></section>`;
  }
  function galleryPage() {
    return `<section class="content-width inner-page gallery-page">${smallIntro(`03 / ${concept.tabs[3]}`,concept.galleryTitle,'A closer look at the materials, moods and details behind this direction.')}<div class="gallery-grid">${concept.gallery.map(([title,description],i)=>`<figure class="gallery-item gallery-item-${i}"><div class="gallery-image">${image('',i===0?'eager':'lazy')}<span>0${i+1}</span></div><figcaption><span>0${i+1} /</span><div><h2>${escape(title)}</h2><p>${escape(description)}</p></div></figcaption></figure>`).join('')}</div><div class="gallery-next"><p>Something caught your eye?</p>${link('contact',concept.tabs[4],'solid-link')}</div></section>`;
  }
  function contactPage() {
    return `<section class="content-width inner-page contact-page"><div class="contact-grid"><div>${smallIntro(`04 / ${concept.contactType}`,concept.contactTitle,concept.contactCopy)}<div class="contact-photo">${image('', 'eager')}</div></div><div class="enquiry-panel"><p class="eyebrow">LET’S START WITH YOU.</p><form id="demo-form"><label>Your name<input name="demo-name" placeholder="Your first name" maxlength="80" required autocomplete="off"></label><label>${concept.id==='restaurant'?'What are you planning?':'What would you like to explore?'}<select name="service" required><option value="">Choose an option</option>${concept.services.map(([name])=>`<option value="${escape(name)}"${serviceChoice===name?' selected':''}>${escape(name)}</option>`).join('')}<option value="Something else">Something else</option></select></label>${concept.contactType==='Appointment'?'<label>Preferred date <span>(optional)</span><input type="date" name="date"></label>':''}<label>A little more detail <span>(optional)</span><textarea name="details" rows="3" maxlength="600" placeholder="Tell us what you have in mind."></textarea></label><button class="solid-link" type="submit">${escape(concept.contactAction)} ${arrow}</button><p class="form-disclaimer">This is an interactive design preview. Your details are not saved or sent, and no booking or enquiry will be made.</p></form><div id="demo-result" class="form-result" role="status" hidden><span class="result-check" aria-hidden="true">✓</span><p class="eyebrow">THAT’S THE EXPERIENCE.</p><h2>Thoughtful, right to the last click.</h2><p>Preview complete — no booking or enquiry has been made. Imagine this journey, tailored to your own business.</p><button type="button" class="solid-link" data-choose-design>Make this direction yours ${arrow}</button><button type="button" class="reset-demo text-link">Try the preview again ↗</button></div></div></div></section>`;
  }
  const views = {home:homePage, services:servicesPage, about:aboutPage, gallery:galleryPage, contact:contactPage};
  function renderPage(initial = false) {
    const requested = location.hash.slice(1);
    const next = pages.includes(requested) ? requested : 'home';
    if (next === pageId && !initial) return;
    pageId = next;
    const main = document.querySelector('#page');
    main.innerHTML = views[next]();
    document.body.dataset.page = next;
    document.querySelectorAll('#concept-nav a').forEach(a => { if(a.hash === '#'+next) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
    closeNavigation();
    window.scrollTo({top:0,behavior:'instant'});
    if(!initial) main.focus({preventScroll:true});
    const form = document.querySelector('#demo-form');
    if(form) {
      form.addEventListener('submit', event => {
        event.preventDefault();
        form.hidden = true;
        const result = document.querySelector('#demo-result');
        result.hidden = false;
        result.tabIndex = -1;
        result.focus({preventScroll:true});
        result.scrollIntoView({block:'center',behavior:'smooth'});
        form.reset();
      });
      document.querySelector('.reset-demo').addEventListener('click',()=>{
        document.querySelector('#demo-result').hidden=true;
        form.hidden=false;
        form.querySelector('input').focus();
      });
    }
  }
  function closeNavigation() {
    document.querySelector('#concept-nav').classList.remove('open');
    const toggle = document.querySelector('.nav-toggle');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open navigation');
  }
  document.querySelector('.nav-toggle').addEventListener('click',()=>{
    const open = document.querySelector('#concept-nav').classList.toggle('open');
    const toggle=document.querySelector('.nav-toggle');
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  });
  document.addEventListener('click',event=>{
    const service = event.target.closest('[data-service]');
    if(service) serviceChoice=service.dataset.service;
    if(event.target.closest('[data-choose-design],#choose-design')) {
      if(parent!==window) parent.postMessage({type:'visora-choose-concept',id:concept.id},'*');
      else location.href=`index.html#start`;
    }
    if(event.target.closest('#concept-nav a,.wordmark')) closeNavigation();
  });
  addEventListener('keydown',event=>{
    if(event.key==='Escape') {
      if(document.querySelector('#concept-nav').classList.contains('open')) closeNavigation();
      else if(parent!==window) parent.postMessage({type:'visora-close-concept'},'*');
    }
  });
  addEventListener('hashchange',()=>renderPage());
  renderPage(true);
})();
