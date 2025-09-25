// Dropdown: tıkla-kapat + dışarı tıklayınca kapa + ESC ile kapa
(function(){
  function closeAll(){ document.querySelectorAll('.dropdown').forEach(d=>d.classList.remove('open')); }

  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('.dropdown > button');
    const dd  = e.target.closest('.dropdown');
    if(btn && dd){
      dd.classList.toggle('open');
      // ARIA
      btn.setAttribute('aria-expanded', dd.classList.contains('open') ? 'true' : 'false');
    } else {
      // dropdown dışında tıklandıysa kapat
      if(!e.target.closest('.dropdown-menu')) closeAll();
    }
  });

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeAll();
  });

  // Desktop'ta hover ile göster (data-hover özelliği olanlar)
  const mq = window.matchMedia('(hover: hover)');
  if(mq.matches){
    document.querySelectorAll('.dropdown[data-hover]').forEach(dd=>{
      dd.addEventListener('mouseenter', ()=> dd.classList.add('open'));
      dd.addEventListener('mouseleave', ()=> dd.classList.remove('open'));
    });
  }
})();
