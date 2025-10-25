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

    p.rect(170, 10, 300, 720);

    p.text("6am", 140, 20);
    p.rect(170, 10, 300, 90);
    p.rect(170, 100, 300, 90);

    p.text("7am", 140, 195);
    p.rect(170, 190, 300, 90);
    p.rect(170, 280, 300, 90);

    p.text("8am", 140, 375);
    p.rect(170, 370, 300, 90);
    p.rect(170, 460, 300, 90);

    p.text("9am", 140, 555);
    p.rect(170, 550, 300, 90);

    p.rect(470, 10, 300, 720);
    p.rect(470, 10, 300, 90);
    p.rect(470, 100, 300, 90);
    p.rect(470, 190, 300, 90);
    p.rect(470, 280, 300, 90);
    p.rect(470, 370, 300, 90);
    p.rect(470, 460, 300, 90);
    p.rect(470, 550, 300, 90);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
