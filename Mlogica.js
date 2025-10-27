// Buscador simple
document.getElementById('buscador').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    alert('Buscando: ' + this.value);
  }
});

// Máquina de escribir con borrado y cambio de palabras
const palabras = [
  "Tutorías en Línea",
  "Tutorías Personalizadas",
  "Éxito Académico"
];
let palabraActual = 0;
let letraActual = 0;
let borrando = false;

function maquinaEscribir() {
  const elemento = document.getElementById('maquina-escribir');
  // Asegurarse de que el elemento exista antes de continuar
  if (!elemento) return; 
  
  const texto = palabras[palabraActual];

  if (!borrando && letraActual <= texto.length) {
    elemento.textContent = texto.slice(0, letraActual);
    letraActual++;
    setTimeout(maquinaEscribir, 130);
  } else if (borrando && letraActual >= 0) {
    elemento.textContent = texto.slice(0, letraActual);
    letraActual--;
    setTimeout(maquinaEscribir, 70);
  } else if (!borrando) {
    borrando = true;
    setTimeout(maquinaEscribir, 1200); // pausa antes de borrar
  } else {
    borrando = false;
    palabraActual = (palabraActual + 1) % palabras.length;
    setTimeout(maquinaEscribir, 200); // pausa antes de siguiente palabra
  }
}

// --- LÓGICA DEL CARRUSEL DE TUTORES (REESCRITA PARA BOTONES) ---
function setupTutorCarousel() {
  const track = document.querySelector('.carousel-track');
  if (!track) return; 

  const wrapper = document.querySelector('.carousel-wrapper');
  if (!wrapper) return; 
    
  const btnPrev = wrapper.querySelector('.carousel-btn.prev');
  const btnNext = wrapper.querySelector('.carousel-btn.next');
  
  const cards = Array.from(track.children);
  const cardCount = cards.length;
  if (cardCount === 0) return;

  // 1. Clonamos las tarjetas
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  // 2. Leemos el ancho de la tarjeta desde el CSS
  const cardStyle = window.getComputedStyle(cards[0]);
  const cardWidth = parseFloat(cardStyle.flexBasis); // 280px
  const cardGap = parseFloat(cardStyle.marginRight); // 20px
  const cardStep = cardWidth + cardGap; // 300px
  
  let currentIndex = 0; // Empezamos al inicio
  let isMoving = false; // Flag para evitar clicks dobles
  const transitionTime = 400; // 400ms (debe coincidir con el CSS)

  // 3. Listener para el botón SIGUIENTE
  btnNext.addEventListener('click', () => {
    if (isMoving) return;
    isMoving = true;
    
    currentIndex++;
    track.style.transform = `translateX(-${currentIndex * cardStep}px)`;
    
    // Lógica de loop infinito (cuando llega al inicio de los clones)
    if (currentIndex === cardCount) {
      setTimeout(() => {
        track.style.transition = 'none'; // Sin animación
        currentIndex = 0; // Vuelve al inicio
        track.style.transform = `translateX(0)`;
        track.offsetHeight; // Forzar repintado
        track.style.transition = 'transform 0.4s ease-in-out';
      }, transitionTime);
    }

    setTimeout(() => { isMoving = false; }, transitionTime);
  });

  // 4. Listener para el botón ANTERIOR
  btnPrev.addEventListener('click', () => {
    if (isMoving) return;
    isMoving = true;

    if (currentIndex === 0) {
      // Si estamos al inicio, saltamos al final (a los clones)
      track.style.transition = 'none';
      currentIndex = cardCount; // Vamos al inicio de los clones
      track.style.transform = `translateX(-${currentIndex * cardStep}px)`;
      track.offsetHeight; // Forzar repintado
      track.style.transition = 'transform 0.4s ease-in-out';
    }

    // Retraso mínimo para que el "salto" se registre
    setTimeout(() => {
      currentIndex--;
      track.style.transform = `translateX(-${currentIndex * cardStep}px)`;
      setTimeout(() => { isMoving = false; }, transitionTime);
    }, 50); // 50ms de retraso
  });
}


// --- Lógica del Carrusel de Imágenes CTA (NUEVA) ---
function setupCtaCarousel() {
  const carousel = document.querySelector('.cta-image-wrapper');
  if (!carousel) return; 

  const images = carousel.querySelectorAll('.cta-image-main');
  if (images.length < 2) return; 

  let currentIndex = 0;

  function rotateImages() {
    const activeIndex = currentIndex;
    const prev1Index = (currentIndex - 1 + images.length) % images.length;
    const prev2Index = (currentIndex - 2 + images.length) % images.length;

    images.forEach(img => img.classList.remove('active', 'prev1', 'prev2'));

    images[activeIndex].classList.add('active');
    images[prev1Index].classList.add('prev1');
    images[prev2Index].classList.add('prev2');

    currentIndex = (currentIndex + 1) % images.length;
  }

  rotateImages();
  setInterval(rotateImages, 3000); 
}

// --- Lógica del Carrusel de Logos ---
function setupLogoCarousel() {
  const track = document.querySelector('.logo-carousel-track');
  if (!track) return; 

  const logos = Array.from(track.children);
  const logoCount = logos.length;
  if (logoCount === 0) return;

  logos.forEach(logo => {
    const clone = logo.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  const firstLogo = logos[0];

  const setupAnimation = () => {
    const logoStyle = window.getComputedStyle(firstLogo);
    const logoWidth = firstLogo.offsetWidth;
    const logoMarginLeft = parseFloat(logoStyle.marginLeft);
    const logoMarginRight = parseFloat(logoStyle.marginRight);
    const logoTotalWidth = logoWidth + logoMarginLeft + logoMarginRight;

    const totalWidth = logoTotalWidth * (logoCount * 2);
    const scrollWidth = logoTotalWidth * logoCount;
    const duration = logoCount * 2.5; 

    const animationName = 'scroll-logos';
    const keyframes = `
    @keyframes ${animationName} {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-${scrollWidth}px);
      }
    }`;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = keyframes;
    document.head.appendChild(styleSheet);

    track.style.width = `${totalWidth}px`;
    track.style.animation = `${animationName} ${duration}s linear infinite`;
  };

  if (firstLogo.complete) {
    setupAnimation();
  } else {
    firstLogo.onload = setupAnimation;
  }
}

// --- Lógica del Contador Animado ---
function setupContadores() {
  const contadorTutores = document.getElementById('contador-tutores');
  const contadorEstudiantes = document.getElementById('contador-estudiantes');
  const contadorUsuarios = document.getElementById('contador-usuario'); 
  const contadorEnplaystore = document.getElementById('contador-playstore');
  const seccion = document.querySelector('.contador-section');

  if (!seccion || !contadorTutores || !contadorEstudiantes) return;

  function animateCount(el, start, end, duration) {
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentNumber = Math.floor(progress * (end - start) + start);

      el.textContent = '+' + currentNumber;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(contadorTutores, 0, 370, 1500); 
        animateCount(contadorEstudiantes, 0, 441, 1500); 
        animateCount(contadorUsuarios, 0, 811, 1500);
        animateCount(contadorEnplaystore, 0, 4.5, 1500);

        observer.unobserve(seccion);
      }
    });
  }, { threshold: 0.1 }); 

  observer.observe(seccion);
}

// --- FUNCIÓN DE ANIMACIÓN AL HACER SCROLL (PARA LAS TARJETAS) ---
function setupScrollAnimation() {
  
  // 1. Selecciona todas las tarjetas
  const cards = document.querySelectorAll('.alianza-evento-card');
  
  // Si no hay tarjetas, no hace nada
  if (cards.length === 0) return;

  // 2. Opciones del observador
  const observerOptions = {
    threshold: 0.1 // Se activa cuando el 10% de la tarjeta es visible
  };

  // 3. Función que se ejecuta cuando una tarjeta entra en pantalla
  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Le añade la clase 'animate-in'
        entry.target.classList.add('animate-in');
        // Deja de observarla para que no se repita
        observer.unobserve(entry.target);
      }
    });
  };

  // 4. Crea el observador
  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // 5. Le dice al observador que vigile cada tarjeta
  cards.forEach(card => {
    observer.observe(card);
  });
}

// --- Event Listener Principal ---
// Llama a todas las funciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  maquinaEscribir();
  setupTutorCarousel(); 
  setupCtaCarousel(); 
  setupLogoCarousel();
  setupContadores();
  setupScrollAnimation(); // <-- Aquí se llama a la función de la animación
});