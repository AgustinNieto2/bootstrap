// ===================== NAVEGACIÓN ENTRE PANTALLAS =====================
let screenHistory = [];
const visitedNuclei = new Set(JSON.parse(sessionStorage.getItem('visitedNuclei') || '[]'));

function showScreen(id, { trackHistory = true } = {}) {
  const current = document.querySelector('.screen.active');
  if (trackHistory && current && current.id !== id) {
    screenHistory.push(current.id);
  }
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'screen-produccion' || id === 'screen-impacto') {
    visitedNuclei.add(id);
    sessionStorage.setItem('visitedNuclei', JSON.stringify([...visitedNuclei]));
  }
  window.scrollTo(0, 0);
}

function goBack() {
  const prev = screenHistory.pop();
  if (prev) showScreen(prev, { trackHistory: false });
}

function goHome() {
  screenHistory = [];
  showScreen('screen-hub', { trackHistory: false });
}

// Landing -> Hub
document.getElementById('btn-comenzar').addEventListener('click', () => {
  showScreen('screen-hub');

  const hubContent = document.querySelector('#screen-hub .hub-content');
  hubContent.classList.remove('zoom-in');
  void hubContent.offsetWidth;
  hubContent.classList.add('zoom-in');
});

document.getElementById('btn-generacion-landing').addEventListener('click', () => {
  showScreen('screen-produccion');
});

document.getElementById('btn-impacto-landing').addEventListener('click', () => {
  showScreen('screen-impacto');
});

// Tarjetas del hub -> abren su panel correspondiente
// Nota: "Realismo" no tiene panel propio en el video, entra directo a "Casos reales"
// (mismo contenido al que también se llega desde el submenú "Impacto"). Si en su Figma
// la tarjeta Realismo abre otra pantalla, avisame y la separamos.
const HUB_TARGETS = {
  produccion: 'screen-produccion',
  herramientas: 'screen-herramientas',
  impacto: 'screen-impacto'
};

document.querySelectorAll('.hub-card').forEach(card => {
  card.addEventListener('click', () => {
    const screenId = HUB_TARGETS[card.dataset.target] || card.dataset.target;
    if (screenId && document.getElementById(screenId)) {
      showScreen(screenId);
    } else {
      console.log('Pantalla todavía no armada:', card.dataset.target);
    }
  });
});

// Tarjetas del submenú "Producción" -> abren su pantalla de contenido
document.querySelectorAll('.submenu-card').forEach(card => {
  card.addEventListener('click', () => {
    showScreen(card.dataset.target);
  });
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      showScreen(card.dataset.target);
    }
  });
});

const infoData = {
  genera: {
    category: 'Producción',
    title: 'Tareas que acelera la IA',
    description: 'La IA permite automatizar tareas repetitivas y acelerar la creación de piezas publicitarias.',
    stats: [['Generación de piezas', '70%'], ['Reducción de tiempos', '45%']],
    metric: ['10x', 'más rápido el flujo de trabajo']
  },
  proceso: {
    category: 'Proceso',
    title: 'Del concepto a la pieza final',
    description: 'Un flujo asistido por IA combina una idea, referencias visuales, generación y edición final.',
    stats: [['Bocetos explorados', '82%'], ['Iteraciones más rápidas', '65%']],
    metric: ['4 pasos', 'para convertir una idea en contenido']
  },
  herramientas: {
    category: 'Herramientas',
    title: 'Adopción de software generativo',
    description: 'Las agencias integran modelos de difusión y asistentes de texto en sus flujos creativos diarios.',
    stats: [['Agencias que usan IA visual', '82%'], ['Campañas con copy asistido', '65%']],
    metric: ['+300%', 'de crecimiento en herramientas implementadas']
  },
  realismo: {
    category: 'Realismo',
    title: 'Percepción y detección visual',
    description: 'La fidelidad de la IA desafía la capacidad del ojo humano para distinguir contenido sintético.',
    stats: [['Usuarios que confunden imágenes IA', '68%'], ['Coherencia visual sintética', '91%']],
    metric: ['6 de 10', 'personas no detectan imperfecciones']
  },
  impacto: {
    category: 'Impacto',
    title: 'Rendimiento y métricas de mercado',
    description: 'La hiperpersonalización puede mejorar la interacción, aunque también modifica la percepción de autenticidad.',
    stats: [['Aumento estimado del CTR', '35%'], ['Variaciones generadas automáticamente', '88%']],
    metric: ['+2,7 M', 'de impresiones en iteraciones dinámicas']
  },
  casos: {
    category: 'Casos reales',
    title: 'Marcas que experimentan con IA',
    description: 'Las marcas usan IA para explorar ideas, acelerar campañas y producir variaciones visuales.',
    stats: [['Ideas exploradas en menos tiempo', '75%'], ['Piezas visuales iteradas', '88%']],
    metric: ['2 casos', 'Heinz y Coca-Cola como referencia']
  }
};

function openInfoModal(key) {
  const data = infoData[key];
  if (!data) return;
  document.getElementById('data-category').textContent = data.category;
  document.getElementById('data-title').textContent = data.title;
  document.getElementById('data-description').textContent = data.description;
  document.getElementById('data-stats').innerHTML = data.stats.map(([label, value]) => `
    <div class="data-stat">
      <div><span>${label}</span><strong>${value}</strong></div>
      <div class="data-bar"><i style="width:${value}"></i></div>
    </div>`).join('');
  document.getElementById('data-metric-number').textContent = data.metric[0];
  document.getElementById('data-metric-text').textContent = data.metric[1];
  document.getElementById('data-modal').classList.remove('hidden');
}

document.querySelectorAll('.info-trigger').forEach(button => {
  button.addEventListener('click', event => {
    event.stopPropagation();
    openInfoModal(button.dataset.info);
  });
});

document.querySelector('.data-modal-close').addEventListener('click', () => {
  document.getElementById('data-modal').classList.add('hidden');
});

document.getElementById('data-modal').addEventListener('click', event => {
  if (event.target.id === 'data-modal') event.currentTarget.classList.add('hidden');
});

function syncProductionInfoButtons() {
  const infoByTarget = {
    'screen-que-genera-ia': 'genera',
    'screen-proceso-generacion': 'proceso',
    'screen-herramientas': 'herramientas',
    'screen-tradicional-vs-ia': 'impacto',
    'screen-marketing-digital': 'herramientas'
  };
  document.querySelectorAll('#screen-produccion .production-card').forEach(card => {
    const button = card.querySelector('.info-trigger');
    if (button) button.dataset.info = infoByTarget[card.dataset.target] || 'genera';
  });
}

syncProductionInfoButtons();

const triviaQuestions = [
  { text: '¿Esta imagen publicitaria fue creada con IA?', answer: 'ia', media: 'Trivia/imagen.jpg', type: 'image' },
  { text: '¿Este contenido de Coca-Cola fue creado con IA?', answer: 'real', media: 'Trivia/cocacola.gif', type: 'image' },
  { text: '¿Este video publicitario es real?', answer: 'ia', media: 'Trivia/bolt.gif', type: 'image' }
];
let triviaIndex = 0;
let triviaScore = 0;
let triviaTimer = null;
let triviaTimeLeft = 10;

function openTrivia() {
  if (visitedNuclei.size < 2) {
    document.querySelectorAll('.trivia-lock-message').forEach(message => {
      message.classList.add('hidden');
    });
    const currentMessage = document.querySelector('.screen.active .trivia-lock-message');
    if (currentMessage) currentMessage.classList.remove('hidden');
    return;
  }
  document.querySelectorAll('.trivia-lock-message').forEach(message => {
    message.classList.add('hidden');
  });
  document.getElementById('register-error').classList.add('hidden');
  document.getElementById('register-name').value = '';
  showScreen('screen-register');
  document.getElementById('register-name').focus();
}

function startTrivia() {
  clearInterval(triviaTimer);
  triviaIndex = 0;
  triviaScore = 0;
  document.getElementById('trivia-question-view').classList.remove('hidden');
  document.getElementById('trivia-result-view').classList.add('hidden');
  showScreen('screen-trivia');
  loadTriviaQuestion();
}

function loadTriviaQuestion() {
  const question = triviaQuestions[triviaIndex];
  clearInterval(triviaTimer);
  triviaTimeLeft = 10;
  updateTriviaTimer();
  triviaTimer = setInterval(() => {
    triviaTimeLeft--;
    updateTriviaTimer();
    if (triviaTimeLeft <= 0) {
      clearInterval(triviaTimer);
      triviaIndex++;
      if (triviaIndex < triviaQuestions.length) loadTriviaQuestion();
      else showTriviaResult();
    }
  }, 1000);
  document.getElementById('trivia-progress').textContent = `Pregunta ${triviaIndex + 1} de ${triviaQuestions.length}`;
  document.getElementById('trivia-question').textContent = question.text;

  const image = document.getElementById('trivia-image');
  const video = document.getElementById('trivia-video');
  image.classList.toggle('hidden', question.type !== 'image');
  video.classList.toggle('hidden', question.type !== 'video');
  if (question.type === 'video') {
    video.src = question.media;
    video.load();
  } else {
    video.pause();
    video.removeAttribute('src');
    image.src = question.media;
  }
}

function updateTriviaTimer() {
  const timer = document.getElementById('trivia-time');
  timer.textContent = triviaTimeLeft;
  timer.classList.toggle('urgent', triviaTimeLeft <= 3);
}

function showTriviaResult() {
  clearInterval(triviaTimer);
  document.getElementById('trivia-question-view').classList.add('hidden');
  document.getElementById('trivia-result-view').classList.remove('hidden');
  document.getElementById('trivia-score').textContent = triviaScore;
  document.getElementById('trivia-chart-label').textContent = `${Math.round((triviaScore / triviaQuestions.length) * 100)}%`;
  document.querySelector('.trivia-chart').style.setProperty('--score', `${(triviaScore / triviaQuestions.length) * 100}%`);
}

document.addEventListener('click', event => {
  const triviaButton = event.target.closest('[data-trivia-open]');
  if (triviaButton) {
    event.preventDefault();
    event.stopPropagation();
    openTrivia();
  }
});

document.getElementById('trivia-back').addEventListener('click', () => {
  clearInterval(triviaTimer);
  showScreen('screen-hub', { trackHistory: false });
});

document.getElementById('register-back').addEventListener('click', () => {
  showScreen('screen-hub', { trackHistory: false });
});

document.getElementById('register-form').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('register-name').value.trim();
  if (!name) {
    document.getElementById('register-error').classList.remove('hidden');
    return;
  }
  document.getElementById('register-error').classList.add('hidden');
  startTrivia();
});

document.querySelectorAll('.trivia-options button').forEach(button => {
  button.addEventListener('click', () => {
    clearInterval(triviaTimer);
    if (button.dataset.answer === triviaQuestions[triviaIndex].answer) triviaScore++;
    triviaIndex++;
    if (triviaIndex < triviaQuestions.length) loadTriviaQuestion();
    else showTriviaResult();
  });
});

let productionSlide = 1;

function setProductionSlide(slide, direction = 'next') {
  productionSlide = slide;
  const grid = document.querySelector('#screen-produccion .submenu-grid');
  const cards = grid.querySelectorAll('.production-card');
  const leftCard = cards[0];
  const centerCard = cards[1];
  const rightCard = cards[2];

  if (slide === 2) {
    leftCard.dataset.target = 'screen-que-genera-ia';
    leftCard.querySelector('.submenu-thumb').className = 'submenu-thumb thumb-genera';
    leftCard.querySelector('span').innerHTML = '¿Qué puede<br>generar la IA?<br>Tareas que acelera la IA';
    centerCard.dataset.target = 'screen-herramientas';
    centerCard.querySelector('.submenu-thumb').className = 'submenu-thumb thumb-herramientas';
    centerCard.querySelector('span').innerHTML = 'Herramientas de la IA';
    rightCard.dataset.target = 'screen-tradicional-vs-ia';
    rightCard.querySelector('.submenu-thumb').className = 'submenu-thumb thumb-tradicional';
    rightCard.querySelector('span').innerHTML = 'Producción<br>tradicional vs IA';
  } else if (slide === 3) {
    leftCard.dataset.target = 'screen-herramientas';
    leftCard.querySelector('.submenu-thumb').className = 'submenu-thumb thumb-herramientas';
    leftCard.querySelector('span').innerHTML = 'Herramientas<br>de la IA';
    centerCard.dataset.target = 'screen-tradicional-vs-ia';
    centerCard.querySelector('.submenu-thumb').className = 'submenu-thumb thumb-tradicional';
    centerCard.querySelector('span').innerHTML = 'Producción<br>tradicional vs IA';
    rightCard.dataset.target = 'screen-marketing-digital';
    rightCard.querySelector('.submenu-thumb').className = 'submenu-thumb thumb-marketing';
    rightCard.querySelector('span').innerHTML = 'IA en Marketing<br>Digital';
  } else if (slide === 4) {
    leftCard.dataset.target = 'screen-tradicional-vs-ia';
    leftCard.querySelector('.submenu-thumb').className = 'submenu-thumb thumb-tradicional';
    leftCard.querySelector('span').innerHTML = 'Producción<br>tradicional vs IA';
    centerCard.dataset.target = 'screen-marketing-digital';
    centerCard.querySelector('.submenu-thumb').className = 'submenu-thumb thumb-marketing';
    centerCard.querySelector('span').innerHTML = 'IA en Marketing Digital<br>y Empresas usando IA';
    rightCard.dataset.target = 'screen-que-genera-ia';
    rightCard.querySelector('.submenu-thumb').className = 'submenu-thumb thumb-genera';
    rightCard.querySelector('span').innerHTML = '¿Qué puede<br>generar la IA?';
  } else if (slide === 5) {
    leftCard.dataset.target = 'screen-marketing-digital';
    leftCard.querySelector('.submenu-thumb').className = 'submenu-thumb thumb-marketing';
    leftCard.querySelector('span').innerHTML = 'IA en Marketing<br>Digital';
    centerCard.dataset.target = 'screen-que-genera-ia';
    centerCard.querySelector('.submenu-thumb').className = 'submenu-thumb thumb-genera';
    centerCard.querySelector('span').innerHTML = '¿Qué puede generar la IA?<br>Tareas que acelera la IA';
    rightCard.dataset.target = 'screen-proceso-generacion';
    rightCard.querySelector('.submenu-thumb').className = 'submenu-thumb thumb-proceso';
    rightCard.querySelector('span').innerHTML = 'Proceso de generación<br>de contenido con IA';
  } else {
    leftCard.dataset.target = 'screen-que-genera-ia';
    leftCard.querySelector('.submenu-thumb').className = 'submenu-thumb thumb-genera';
    leftCard.querySelector('span').innerHTML = '¿Qué puede<br>generar la IA?<br>Tareas que acelera la IA';
    centerCard.dataset.target = 'screen-proceso-generacion';
    centerCard.querySelector('.submenu-thumb').className = 'submenu-thumb thumb-proceso';
    centerCard.querySelector('span').innerHTML = 'Proceso de generación<br>de contenido con IA';
    rightCard.dataset.target = 'screen-herramientas';
    rightCard.querySelector('.submenu-thumb').className = 'submenu-thumb thumb-herramientas';
    rightCard.querySelector('span').innerHTML = 'Herramientas<br>de la IA';
  }

  grid.classList.remove('production-slide-next', 'production-slide-prev');
  void grid.offsetWidth;
  grid.classList.add(`production-slide-${direction}`);
  syncProductionInfoButtons();
}

document.getElementById('production-next').addEventListener('click', () => {
  if (productionSlide < 5) setProductionSlide(productionSlide + 1, 'next');
});

document.getElementById('production-prev').addEventListener('click', () => {
  if (productionSlide > 1) setProductionSlide(productionSlide - 1, 'prev');
});

// Cualquier botón "VOLVER ATRÁS" usa el historial real de navegación
document.querySelectorAll('.btn-back').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.id !== 'impact-back' && btn.id !== 'production-back' && btn.id !== 'hub-back') goBack();
  });
});

document.getElementById('hub-back').addEventListener('click', () => {
  screenHistory = [];
  showScreen('screen-landing', { trackHistory: false });
});

document.getElementById('impact-back').addEventListener('click', () => {
  showScreen('screen-hub', { trackHistory: false });
});

document.getElementById('production-back').addEventListener('click', () => {
  showScreen('screen-hub', { trackHistory: false });
});

// El botón X siempre vuelve directo al hub y limpia el historial
document.querySelectorAll('.btn-close[data-back="screen-hub"]').forEach(btn => {
  btn.addEventListener('click', goHome);
});

// ===================== TOOLTIPS (íconos y pills) =====================
// Cualquier elemento con data-tooltip muestra el texto al pasar el mouse.
// Los círculos del diagrama de Venn (Impacto en el consumidor) NO usan este
// tooltip flotante: tienen su propio modal centrado con blur (ver más abajo).
const tooltipBox = document.getElementById('tooltip-box');

document.querySelectorAll('[data-tooltip]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    const text = el.dataset.tooltip;
    tooltipBox.textContent = text;
    tooltipBox.classList.remove('hidden');

    const rect = el.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - 120;
    let top = rect.bottom + 10;

    // Mantiene el tooltip dentro de la pantalla y evita cubrir los controles.
    left = Math.max(12, Math.min(left, window.innerWidth - 252));
    const tooltipHeight = tooltipBox.offsetHeight;
    if (top + tooltipHeight > window.innerHeight - 12) {
      top = rect.top - tooltipHeight - 10;
    }
    top = Math.max(12, top);

    tooltipBox.style.left = left + 'px';
    tooltipBox.style.top = top + 'px';
  });

  el.addEventListener('mouseleave', () => {
    tooltipBox.classList.add('hidden');
  });
});

// ===================== MODAL DEL DIAGRAMA DE VENN (Impacto en el consumidor) =====================
// Al pasar el cursor sobre CONFIANZA / AUTENTICIDAD / DIFICULTAD DE RECONOCIMIENTO,
// se agranda levemente el círculo y se abre un modal centrado con fondo blur.
// El modal se queda abierto hasta que se cierra con la X o haciendo click afuera.
const vennOverlay = document.getElementById('venn-modal-overlay');
const vennModalTitle = document.getElementById('venn-modal-title');
const vennModalText = document.getElementById('venn-modal-text');
const vennModalClose = document.getElementById('venn-modal-close');

function openVennModal(circle) {
  document.querySelectorAll('.venn-circle').forEach(c => c.classList.remove('zoomed'));
  circle.classList.add('zoomed');
  vennModalTitle.textContent = circle.dataset.title;
  vennModalText.textContent = circle.dataset.text;
  vennOverlay.classList.remove('hidden');
  // Forzamos reflow para que la transición de opacidad se dispare siempre
  void vennOverlay.offsetWidth;
  vennOverlay.classList.add('active');
}

function closeVennModal() {
  vennOverlay.classList.remove('active');
  document.querySelectorAll('.venn-circle').forEach(c => c.classList.remove('zoomed'));
  setTimeout(() => vennOverlay.classList.add('hidden'), 250);
}

document.querySelectorAll('.venn-circle').forEach(circle => {
  circle.addEventListener('mouseenter', () => openVennModal(circle));
});

vennModalClose.addEventListener('click', closeVennModal);

vennOverlay.addEventListener('click', (e) => {
  if (e.target === vennOverlay) closeVennModal();
});

// Se dispara cada vez que se muestra la pantalla de Impacto en el consumidor
const _showScreenOriginal = showScreen;
showScreen = function (id, opts) {
  _showScreenOriginal(id, opts);
  if (id === 'screen-impacto-consumidor') {
    closeVennModal();
    const panel = document.querySelector('#screen-impacto-consumidor .panel');
    panel.classList.remove('zoom-in');
    // Forzamos reflow para poder re-disparar la animación cada vez que se entra
    void panel.offsetWidth;
    panel.classList.add('zoom-in');
  }
};

