class Point {
  constructor(x, y, w, h) {
    var options = {
      isStatic: true
    }

    this.body = createSprite(x, y, w, h, options);
    this.w = w;
    this.h = h;
  }

  show() {
    var posx = this.body.x;
    var posy = this.body.y;
    push();
    rectMode(CENTER);
    noStroke();
    rect(posx, posy, this.w, this.h);
    pop();
  }
}