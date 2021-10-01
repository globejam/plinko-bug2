class Plinko {
    constructor(x, y, r) {
        var options = {
            isStatic: true,
            restitution: 1,
            friction: 0
        }
        this.body = Bodies.circle(x, y, r, options);
        this.body.label = "plinko";
        this.r = r;
        World.add(world, this.body);
    }   
    show() {
        fill("#9c9c9c");
        stroke("#9c9c9c");
        var pos = this.body.position;
        push();
        translate(pos.x, pos.y);
        ellipse(0, 0, this.r * 2);
        pop();
    }
}