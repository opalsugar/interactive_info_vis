// Instance-mode sketch for tab 3
registerSketch("sk3", function (p) {
  let startBtn;
  // 0.0 = empty, 1.0 = full
  let coffeeLevel = 1;

  let mySound;
  p.preload = function () {
    p.soundFormats("mp3");
    mySound = p.loadSound("assets/coffeemeditation");
  };

  p.setup = function () {
    p.createCanvas(800, 800);
    startBtn = p.createButton("Start");
    startBtn.size(100, 30);
    startBtn.position(350, 230);
    startBtn.style("font-style", "italic");

    startBtn.mousePressed(() => {
      mySound.play();
    });
  };

  p.draw = function () {
    // background
    p.background(200);
    p.fill(0);
    p.textSize(16);
    p.textStyle(p.ITALIC);
    p.textAlign(p.CENTER);
    p.text("coffee meditation.", 400, 100);
    p.text("grab a cup of coffee, sip, and start your day.", 400, 150);

    // center position and scale
    let cx = p.width / 2;
    let cy = p.height / 2 + 50;
    let s = 2.0; // scale factor, adjust if you want bigger/smaller

    drawCoffeeCup(cx, cy, s, coffeeLevel);
  };

  // Draw a coffee cup with handle and coffee fill
  function drawCoffeeCup(cx, cy, s, level) {
    // Cup dimensions
    let cupW = 150 * s;
    let cupH = 200 * s;
    let wall = 12 * s;
    let rimRadius = 18 * s;

    // Saucer (optional)
    p.noStroke();
    p.fill(230);
    p.ellipse(cx, cy + cupH, cupW * 1.2, wall * 5);

    // Cup body (outer)
    let x = cx - cupW / 2;
    let y = cy - cupH / 2;

    p.stroke(30);
    p.strokeWeight(2);
    p.fill(255);
    p.rect(x, y, cupW, cupH, rimRadius);

    // Inner cavity rect (where coffee lives)
    let innerX = x + wall;
    let innerY = y + wall;
    let innerW = cupW - wall * 2;
    let innerH = cupH - wall * 2;

    // Coffee fill height based on level (clamped)
    if (level < 0) {
      level = 0;
    }
    if (level > 1) {
      level = 1;
    }
    let coffeeH = innerH * level;
    let coffeeY = innerY + (innerH - coffeeH); // fill from bottom upward

    // Coffee color and fill
    p.noStroke();
    p.fill(92, 58, 32); // coffee brown
    if (coffeeH > 0) {
      p.rect(
        innerX,
        coffeeY,
        innerW,
        coffeeH,
        rimRadius * 0.6,
        rimRadius * 0.6,
        4,
        4
      );
    }

    // Redraw cup rim and body outline to sit on top of coffee edges
    p.noFill();
    p.stroke(30);
    p.strokeWeight(2);
    p.rect(x, y, cupW, cupH, rimRadius);

    // Handle (two ellipses to create a ring)
    let handleCx = x + cupW + 26 * s;
    let handleCy = cy;
    let handleOuterW = 68 * s;
    let handleOuterH = 60 * s;
    let handleInnerW = 42 * s;
    let handleInnerH = 36 * s;

    // outer handle
    p.noStroke();
    p.fill(255);
    p.ellipse(handleCx, handleCy, handleOuterW, handleOuterH);

    // inner hole of handle (match background to create ring)
    p.fill(245);
    p.ellipse(handleCx, handleCy, handleInnerW, handleInnerH);

    // cup shadow front
    p.noStroke();
    p.fill(0, 0, 0, 18);
    p.ellipse(cx, cy + cupH * 0.52, cupW * 0.9, wall * 3);
  }

  p.windowResized = function () {
    p.resizeCanvas(800, 800);
  };
});
