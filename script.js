// Interactividad para VetCare: menú móvil, scroll suave, modal de servicios y carrusel de testimonios
document.addEventListener('DOMContentLoaded', function(){
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const modal = document.getElementById('modal');

  // Toggle menú móvil
  navToggle && navToggle.addEventListener('click', function(){
    mainNav.classList.toggle('open');
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
  });

  // Scroll suave para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href.length>1){
        e.preventDefault();
        const target = document.querySelector(href);
        if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
        // cerrar menú móvil si está abierto
        if(mainNav.classList.contains('open')) mainNav.classList.remove('open');
      }
    });
  });

  // Abrir modal con info de servicio
  function openModal(title, desc){
    modal.setAttribute('aria-hidden','false');
    modal.innerHTML = `
      <div class="modal-card">
        <h3>${title}</h3>
        <p>${desc}</p>
        <div style="text-align:right;margin-top:1rem"><button id="closeModal" class="btn secondary">Cerrar</button></div>
      </div>`;
    document.getElementById('closeModal').addEventListener('click', closeModal);
    modal.addEventListener('click', function onBg(e){ if(e.target===modal) closeModal(); });
  }
  function closeModal(){ modal.setAttribute('aria-hidden','true'); modal.innerHTML=''; }

  document.querySelectorAll('.service-card').forEach(card=>{
    card.querySelector('.btn')?.addEventListener('click', function(e){
      const title = card.dataset.title || card.querySelector('h3')?.textContent || 'Servicio';
      const desc = card.dataset.desc || card.querySelector('p')?.textContent || '';
      openModal(title, desc);
    });
  });

  // Carrusel de testimonios
  const testimonials = Array.from(document.querySelectorAll('.testi'));
  const prevBtn = document.querySelector('.t-prev');
  const nextBtn = document.querySelector('.t-next');
  let current = 0;
  let autoplayId = null;

  function showTest(index){
    if(testimonials.length===0) return;
    current = (index + testimonials.length) % testimonials.length;
    testimonials.forEach((t, i)=>{
      const hidden = i !== current;
      t.setAttribute('aria-hidden', String(hidden));
      if(hidden){ t.style.opacity = 0; t.style.transform = 'translateX(20px)'; t.style.position='absolute'; }
      else{ t.style.opacity = 1; t.style.transform = 'translateX(0)'; t.style.position='relative'; }
    });
  }

  prevBtn?.addEventListener('click', ()=>{ showTest(current-1); resetAutoplay(); });
  nextBtn?.addEventListener('click', ()=>{ showTest(current+1); resetAutoplay(); });

  function startAutoplay(){
    if(autoplayId) clearInterval(autoplayId);
    autoplayId = setInterval(()=> showTest(current+1), 6000);
  }
  function resetAutoplay(){ startAutoplay(); }

  showTest(0);
  startAutoplay();
});

