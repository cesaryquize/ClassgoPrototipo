// Buscador simple
document.getElementById('buscador').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    alert('Buscando: ' + this.value);
  }
});

// Máquina de escribir con borrado y cambio de palabras
const palabras = [
  "Tutorías en Línea",
  "Clases Personalizadas",
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

// --- Lógica del Carrusel de Tutores ---
function setupTutorCarousel() {
  const track = document.querySelector('.carousel-track');
  if (!track) return; // Si no hay carrusel, no hace nada

  const cards = Array.from(track.children);
  const cardCount = cards.length;
  if (cardCount === 0) return; // Si no hay tarjetas, no hace nada

  // 1. Clonamos las tarjetas para un loop infinito
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  // 2. Leemos el ancho y margen de la tarjeta desde el CSS
  const cardStyle = window.getComputedStyle(cards[0]);
  const cardWidth = parseFloat(cardStyle.flexBasis);
  const cardGap = parseFloat(cardStyle.marginRight);
  const cardTotalWidth = cardWidth + cardGap;
  
  // 3. Calculamos anchos y duración
  const totalWidth = cardTotalWidth * (cardCount * 2); // Ancho total (originales + clones)
  const scrollWidth = cardTotalWidth * cardCount; // Ancho de las originales
  const duration = cardCount * 3; // 3 segundos por tarjeta

  // 4. Inyectamos la animación en la página
  const animationName = 'scroll';
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

  // 5. Aplicamos los estilos y la animación al track
  track.style.width = `${totalWidth}px`;
  track.style.animation = `${animationName} ${duration}s linear infinite`;
}

// --- Lógica del Carrusel de Imágenes CTA (NUEVA) ---
function setupCtaCarousel() {
  const carousel = document.querySelector('.cta-image-wrapper');
  if (!carousel) return; // Si no existe, no hace nada

  const images = carousel.querySelectorAll('.cta-image-main');
  if (images.length < 2) return; // Si hay menos de 2, no hay nada que rotar

  let currentIndex = 0;

  function rotateImages() {
    // Calcula los índices de la imagen actual, la anterior y la de más atrás
    const activeIndex = currentIndex;
    const prev1Index = (currentIndex - 1 + images.length) % images.length;
    const prev2Index = (currentIndex - 2 + images.length) % images.length;

    // Quita todas las clases de todas las imágenes
    images.forEach(img => img.classList.remove('active', 'prev1', 'prev2'));

    // Aplica las clases a las imágenes correctas
    images[activeIndex].classList.add('active');
    images[prev1Index].classList.add('prev1');
    images[prev2Index].classList.add('prev2');

    // Avanza al siguiente índice para la próxima rotación
    currentIndex = (currentIndex + 1) % images.length;
  }

  // Inicia la rotación la primera vez
  rotateImages();
  
  // Configura el intervalo para que rote cada 3 segundos
  setInterval(rotateImages, 3000); 
}


// --- Event Listener Principal ---
// Llama a todas las funciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  maquinaEscribir();
  setupTutorCarousel(); 
  setupCtaCarousel(); // <-- AÑADIDO
  setupLogoCarousel();
});

// --- Lógica del Carrusel de Logos ---
function setupLogoCarousel() {
  const track = document.querySelector('.logo-carousel-track');
  if (!track) return; 

  const logos = Array.from(track.children);
  const logoCount = logos.length;
  if (logoCount === 0) return;

  // 1. Clonamos los logos para un loop infinito
  logos.forEach(logo => {
    const clone = logo.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  // 2. Leemos el ancho y margen del logo desde el CSS
  // Esperamos a que la primera imagen cargue para tener su ancho
  const firstLogo = logos[0];

  const setupAnimation = () => {
    const logoStyle = window.getComputedStyle(firstLogo);
    const logoWidth = firstLogo.offsetWidth;
    const logoMarginLeft = parseFloat(logoStyle.marginLeft);
    const logoMarginRight = parseFloat(logoStyle.marginRight);
    const logoTotalWidth = logoWidth + logoMarginLeft + logoMarginRight;

    // 3. Calculamos anchos y duración
    const totalWidth = logoTotalWidth * (logoCount * 2);
    const scrollWidth = logoTotalWidth * logoCount;
    const duration = logoCount * 2.5; // 2.5 segundos por logo, un poco más rápido

    // 4. Inyectamos la animación (con nombre nuevo)
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

    // 5. Aplicamos los estilos y la animación al track
    track.style.width = `${totalWidth}px`;
    track.style.animation = `${animationName} ${duration}s linear infinite`;
  };

  // Si la imagen ya cargó, corre. Si no, espera.
  if (firstLogo.complete) {
    setupAnimation();
  } else {
    firstLogo.onload = setupAnimation;
  }
}