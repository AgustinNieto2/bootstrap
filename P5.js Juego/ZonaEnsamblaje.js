class ZonaEnsamblaje {
  constructor(nombre, x, y) {
    this.nombre = nombre;
    this.posX = x;
    this.posY = y;
  }

  dibujarGuia() {
    noFill();
    stroke(100);
    ellipse(this.posX, this.posY, 80, 80);
    noStroke();
  }
}
