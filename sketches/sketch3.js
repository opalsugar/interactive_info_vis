// Instance-mode sketch for tab 3
// used copilot for drawing coffee cup, added logic based on sketch12
registerSketch("sk3", function (p) {
  let startBtn;
  const medTime = 5;

  // State
  let running = false;
  let finished = false;
  let startMs = 0;
  let elapsedMs = 0;
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
    startBtn.position(220, 230);
    startBtn.style("font-style", "italic");

    pauseBtn = p.createButton("Pause");
    pauseBtn.size(100, 30);
    pauseBtn.position(350, 230);
    pauseBtn.style("font-style", "italic");

    resetBtn = p.createButton("Reset");
    resetBtn.size(100, 30);
    resetBtn.position(480, 230);
    resetBtn.style("font-style", "italic");

    startBtn.mousePressed(() => {
      if (running) {
        return;
      }
      mySound.play();
      startMs = p.millis();
      running = true;
    });

    pauseBtn.mousePressed(() => {
      if (!running) {
        return;
      }

      elapsedMs += p.millis() - startMs;
      running = false;
      mySound.pause();
    });

    resetBtn.mousePressed(() => {
      running = false;
      finished = false;
      startMs = 0;
      elapsedMs = 0;
      coffeeLevel = 1;
      mySound.stop();
    });
  };

  p.draw = function () {
    // background
    p.background(200);
    p.fill(0);
    p.textSize(16);
    p.textStyle(p.ITALIC);
    p.textAlign(p.CENTER);
    p.text("morning coffee meditation.", 400, 100);
    p.text("grab a cup of coffee, sip, and stay a while.", 400, 150);
    p.text("source: https://www.youtube.com/watch?v=KPoxK5aDEhU", 400, 780);

    // center position and scale
    let cx = p.width / 2;
    let cy = p.height / 2 + 50;
    let s = 2.0; // scale factor, adjust if you want bigger/smaller

    drawCoffeeCup(cx, cy, s, coffeeLevel);

    // timer logic
    const medTimeMs = minutesToMs(medTime);
    const tMs = p.constrain(getElapsedMs(), 0, medTimeMs);
    const remainMs = p.max(0, medTimeMs - tMs);
    const { mm, ss } = msToMMSS(remainMs);
    p.fill(60, 40, 70);
    p.textSize(44);
    p.fill(0);
    p.text(`${mm}:${ss}`, 395, 400);

    coffeeLevel = p.constrain(1 - tMs / medTimeMs, 0, 1);

    if (tMs >= medTimeMs) {
      elapsedMs = medTimeMs;
      running = false;
      finished = true;
      p.textSize(28);
      p.text("now you're ready to start your day.", 400, 730);
    }
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

  // logic (taken from sketch12)
  function getElapsedMs() {
    return running ? p.millis() - startMs + elapsedMs : elapsedMs;
  }

  function minutesToMs(mins) {
    return mins * 60 * 1000;
  }

  function msToMMSS(ms) {
    const total = p.max(0, p.round(ms / 1000));
    const m = p.floor(total / 60);
    const s = total % 60;
    return { mm: p.nf(m, 2), ss: p.nf(s, 2) };
  }

  p.windowResized = function () {
    p.resizeCanvas(800, 800);
  };
});
