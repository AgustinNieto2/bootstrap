class Juego {
  constructor() {
    this.pajaro = new PajaroMecanico(300, 240);
    this.estado = "inicio";
    this.tiempoTotal = 30;
    this.tiempoRestante = this.tiempoTotal;
    this.tiempoInicio = null;
  }

  iniciar() {
    this.estado = "jugando";
    this.tiempoInicio = millis();
  }

  actualizar() {
    this.mostrarFondo();
    if (this.estado === "inicio") this.mostrarInicio();
    else if (this.estado === "instrucciones") this.mostrarInstrucciones();
    else if (this.estado === "creditos") this.mostrarCreditos();
    else if (this.estado === "jugando") this.actualizarJuego();
    else if (this.estado === "completo") {
      this.mostrarVictoria();
      this.mostrarBotonReinicio();
    } else if (this.estado === "perdido") {
      this.mostrarDerrota();
      this.mostrarBotonReinicio();
    }
  }

  mostrarFondo() {
    if (this.estado === "inicio") image(imagenes[1], 0, 0, width, height);
    else if (this.estado === "perdido") image(imagenes[2], 0, 0, width, height);
    else if (this.estado === "completo") image(imagenes[3], 0, 0, width, height);
    else if (this.estado === "instrucciones") image(imagenes[5], 0, 0, width, height);
    else if (this.estado === "creditos") image(imagenes[5], 0, 0, width, height);
    else if (this.estado === "jugando") image(imagenes[5], 0, 0, width, height);
  }

  mousePressed() {
    if (this.estado === "jugando") {
    for (let parte of this.pajaro.partes) parte.mousePressed();
      return;
    }
    if ((this.estado === "completo" || this.estado === "perdido") &&
      this.botonClickeado(mouseX, mouseY)) {
      this.reiniciar();
    }
  }

  mouseReleased() {
    for (let parte of this.pajaro.partes) parte.mouseReleased();
  }

  mouseDragged() {
    for (let parte of this.pajaro.partes) parte.mouseDragged();
  }

  botonClickeado(mx, my) {
    return mx > width / 2 - 60 &&
           mx < width / 2 + 60 &&
           my > height / 2 + 20 &&
           my < height / 2 + 60;
  }

  mostrarInicio() {
    textAlign(CENTER);
    textSize(30);
    fill(0);
    text("Armar el Ruiseñor Mecánico", width / 2, 100);
    textSize(20);
    text("ENTER para empezar", width / 2, 370);
    textSize(16);
    fill(80);
    text("I: Instrucciones   |   C: Créditos", width / 2, 460);
  }

  mostrarInstrucciones() {
    textAlign(CENTER);
    textSize(26);
    fill(0);
    text("INSTRUCCIONES", width / 2, 60);
    textSize(18);
    text("Hacé clic en cada parte del ruiseñor, arrastrala\n y soltala sobre el círculo indicado hasta completarlo.", width / 2, height / 2);
    textSize(16);
    fill(80);
    text("Presiona ENTER para volver", width / 2, height - 40);
  }

  mostrarCreditos() {
    textAlign(CENTER);
    textSize(26);
    fill(0);
    text("CRÉDITOS", width / 2, 60);
    textSize(18);
    text("Juego creado por:\nTomas Valentino Pianelli y Agustin Nieto", width / 2, height / 2);
    textSize(18);
    text("Legajos: 119110/7 y 119101/6", width / 2, height - 190);
    textSize(16);
    fill(80);
    text("ENTER para volver", width / 2, height - 40);
  }

  mostrarVictoria() {
    textAlign(CENTER);
    textSize(28);
    text("¡Ganaste!", width / 2, 60);
    text("¡El Ruiseñor está completo!", width / 2, 90);
  }

  mostrarDerrota() {
    textAlign(CENTER);
    textSize(28);
    fill(200, 0, 0);
    text("Se acabó el tiempo", width / 2, 60);
  }

  mostrarBotonReinicio() {
    fill(150);
    rect(width / 2 - 60, height / 2 + 20, 120, 40, 10);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text("Reiniciar", width / 2, height / 2 + 40);
  }

  actualizarJuego() {
    this.pajaro.dibujar();
    if (this.tiempoInicio !== null) {
    let tiempoPasado = (millis() - this.tiempoInicio) / 1000;
    this.tiempoRestante = max(0, this.tiempoTotal - tiempoPasado);
    }
    fill(0);
    textSize(18);
    textAlign(LEFT);
    text("Tiempo: " + this.tiempoRestante.toFixed(1) + "s", 10, 20);
    if (this.pajaro.verificarEnsamblaje()) {
      this.estado = "completo";
      sonidoGanar.play();
    }
    if (this.tiempoRestante <= 0 && !this.pajaro.completo) {
    this.estado = "perdido";
    sonidoPerder.play();
    }
  }

  reiniciar() {
    this.pajaro = new PajaroMecanico(300, 240);
    this.tiempoInicio = null;
    this.tiempoRestante = this.tiempoTotal;
    this.estado = "inicio";
  }
}
