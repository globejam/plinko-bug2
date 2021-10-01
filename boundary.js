class Boundary {
  constructor(x, y, w, h) {
    var options = {
      isStatic: true
    }
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.w = w;
    this.h = h;
    World.add(world, this.body);
  }

  show() {
    fill("#8f6139");
    stroke("#8f6139");
    var pos = this.body.position;
    push();
    translate(pos.x, pos.y);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h);
    pop();
  }
}
