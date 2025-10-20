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


// --- Event Listener Principal ---
// Llama a ambas funciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  maquinaEscribir();
  setupTutorCarousel(); 
});