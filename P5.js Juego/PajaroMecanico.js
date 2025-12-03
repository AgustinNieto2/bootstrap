class PajaroMecanico {
  constructor(x, y) {
    this.posX = x;
    this.posY = y;
    this.completo = false;
    this.zonas = [new ZonaEnsamblaje("cuerpo", this.posX, this.posY),
    new ZonaEnsamblaje("alaizq", this.posX - 85, this.posY),
    new ZonaEnsamblaje("alader", this.posX + 85, this.posY),
    new ZonaEnsamblaje("cabeza", this.posX, this.posY - 90),
    new ZonaEnsamblaje("cola", this.posX, this.posY + 90)];

    this.partes = [];
    for (let z of this.zonas) {
    this.partes.push(new Parte(z.nombre, random(50, 550), random(50, 350), z));
    }
  }

  dibujar() {
    textAlign(CENTER);
    textSize(24);
    fill(0);
    text("Arma el Pájaro Mecánico del Ruiseñor", width / 2, 60);
    for (let z of this.zonas) z.dibujarGuia();
    for (let p of this.partes) p.dibujar();
  }

  verificarEnsamblaje() {
    for (let p of this.partes) {
    if (!p.colocada) return false;
    }
    this.completo = true;
    return true;
  }
}
