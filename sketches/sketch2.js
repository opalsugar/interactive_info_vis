// Instance-mode sketch for tab 2
registerSketch("sk2", function (p) {
  p.setup = function () {
    p.createCanvas(800, 800);
    p.background(220);
  };

  p.draw = function () {
    p.rect(20, 50, 100, 30);
    p.rect(20, 100, 100, 30);
    p.rect(20, 150, 100, 30);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
