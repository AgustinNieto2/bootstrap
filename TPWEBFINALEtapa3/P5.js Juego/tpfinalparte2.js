// TP#Final Parte 2 - Comisión 5, Leo Garay
// Tomas Pianelli 119110/7 - Agustin Nieto 119101/6
// El Ruiseñor de Emperador
// Video: 

let imagenes = []; 
let juego;
let partesImgs = {}; 
let fuenteBebas;
let sonidoGanar;
let sonidoPerder;
let sonidoEnclaje;

function preload() {
  fuenteBebas = loadFont("data/fuentes/BebasNeue-Regular.ttf");
  sonidoGanar = loadSound("data/sonidos/ganar.mp3");
  sonidoPerder = loadSound("data/sonidos/perder.mp3");
  sonidoEnclaje = loadSound("data/sonidos/engranajes.mp3");
  for (let i = 1; i <= 5; i++) {
    let nombre = "data/imagenes/imagen_0" + i + ".png";
    imagenes[i] = loadImage(nombre);
  }
  partesImgs["cuerpo"]  = loadImage("data/imagenes/cuerpo.png");
  partesImgs["cabeza"]  = loadImage("data/imagenes/cabeza.png");
  partesImgs["cola"]    = loadImage("data/imagenes/cola.png");
  partesImgs["alader"]  = loadImage("data/imagenes/alader.png");
  partesImgs["alaizq"]  = loadImage("data/imagenes/alaizq.png");
}

function setup() {
  createCanvas(640, 480);
  textFont(fuenteBebas);
  juego = new Juego();
}

function draw() {
  juego.actualizar();
}

function mousePressed() {
  juego.mousePressed();
}

function mouseReleased() {
  juego.mouseReleased();
}

function mouseDragged() {
  juego.mouseDragged();
}

function keyPressed() {
  if (key === "i" || key === "I") juego.estado = "instrucciones";
  else if (key === "c" || key === "C") juego.estado = "creditos";
  if (keyCode === ENTER) {
  if (juego.estado === "inicio") juego.iniciar();
  else if (juego.estado === "instrucciones" || juego.estado === "creditos")
  juego.estado = "inicio";
  else if (juego.estado === "completo" || juego.estado === "perdido")
  juego.reiniciar();
  }
}
