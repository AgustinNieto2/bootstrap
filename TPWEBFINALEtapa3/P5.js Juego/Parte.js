class Parte {
  constructor(nombre, x, y, zonaObjetivo) {
    this.nombre = nombre;
    this.posX = x;
    this.posY = y;
    this.zonaObjetivo = zonaObjetivo;
    this.drag = false;
    this.colocada = false;
    this.img = partesImgs[nombre];
    this.ancho = 90;
    this.alto = 90;
  }

  dibujar() {
    if (this.colocada) {
    this.posX = this.zonaObjetivo.posX;
    this.posY = this.zonaObjetivo.posY;
    }
    push();
    imageMode(CENTER);
    image(this.img, this.posX, this.posY, this.ancho, this.alto);
    pop();
  }

  mousePressed() {
    if (this.colocada) return;
    if ( mouseX > this.posX - this.ancho / 2 &&
      mouseX < this.posX + this.ancho / 2 &&
      mouseY > this.posY - this.alto / 2 &&
      mouseY < this.posY + this.alto / 2) {
      this.drag = true;
    }
  }

  mouseReleased() {
    if (this.drag) {
      this.drag = false;
      let d = dist(
      this.posX,
      this.posY,
      this.zonaObjetivo.posX,
      this.zonaObjetivo.posY);
      if (d < 35) {
        this.colocada = true;
        this.posX = this.zonaObjetivo.posX;
        this.posY = this.zonaObjetivo.posY;
        sonidoEnclaje.play();
      }
    }
  }

  mouseDragged() {
    if (this.drag && !this.colocada) {
      this.posX = mouseX;
      this.posY = mouseY;
    }
  }
}
