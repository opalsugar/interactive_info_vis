// Instance-mode sketch for tab 4
registerSketch("sk4", function (p) {
  // bathtub drawing using copilot, timer logic adapted from sketch 12
  // 0.0 = empty, 1.0 = at rim, >1.0 = overflow
  let fillRatio = 0;
  let startBtn;
  const showerTime = 0.25;

  // State
  let running = false;
  let finished = false;
  let startMs = 0;
  let elapsedMs = 0;

  p.setup = function () {
    p.createCanvas(800, 800);
    startBtn = p.createButton("Start");
    startBtn.size(100, 30);
    startBtn.position(220, 160);
    startBtn.style("font-style", "italic");

    pauseBtn = p.createButton("Pause");
    pauseBtn.size(100, 30);
    pauseBtn.position(350, 160);
    pauseBtn.style("font-style", "italic");

    resetBtn = p.createButton("Reset");
    resetBtn.size(100, 30);
    resetBtn.position(480, 160);
    resetBtn.style("font-style", "italic");

    startBtn.mousePressed(() => {
      if (running) {
        return;
      }
      fillLevel = 0;
      startMs = p.millis();
      running = true;
    });

    pauseBtn.mousePressed(() => {
      if (!running) {
        return;
      }

      elapsedMs += p.millis() - startMs;
      running = false;
    });

    resetBtn.mousePressed(() => {
      running = false;
      finished = false;
      startMs = 0;
      elapsedMs = 0;
      fillLevel = 0;
    });
  };

  p.draw = function () {
    p.background(245);

    // center and scale
    let cx = p.width / 2;
    let cy = p.height / 2 + 40;
    let s = 1.0;

    drawBathtub(cx, cy, s, fillRatio);
  };

  // Bathtub with shower head mounted on the tub rim (right), shifted slightly left; vertical stream to bottom
  function drawBathtub(cx, cy, s, ratio) {
    // tub geometry
    let tubW = 480 * s;
    let tubH = 190 * s;
    let wall = 14 * s;
    let rimR = 24 * s;

    // outer tub
    let x = cx - tubW / 2;
    let y = cy - tubH / 2;

    // saucer-like floor shadow
    p.noStroke();
    p.fill(0, 0, 0, 20);
    p.ellipse(cx, cy - 15 + tubH * 0.58, tubW * 1.1, wall * 4);

    // tub outer shell
    p.stroke(40);
    p.strokeWeight(2);
    p.fill(255);
    p.rect(x, y, tubW, tubH, rimR);

    // inner cavity where water goes
    let innerX = x + wall;
    let innerY = y + wall;
    let innerW = tubW - wall * 2;
    let innerH = tubH - wall * 2;

    // clamp in-tub ratio [0..1]
    let inRatio = p.constrain(ratio, 0, 1);

    // water fill inside the tub
    let waterH = innerH * inRatio;
    let waterY = innerY + (innerH - waterH);

    if (waterH > 0) {
      // water
      p.noStroke();
      p.fill(70, 150, 220);
      p.rect(innerX, waterY, innerW, waterH, rimR * 0.55, rimR * 0.55, 6, 6);
    }

    // re-draw rim on top of water edges
    p.noFill();
    p.stroke(40);
    p.strokeWeight(2);
    p.rect(x, y, tubW, tubH, rimR);

    // --- Shower assembly on the tub rim (right), shifted slightly left ---
    // Riser pipe anchored on the inner rim (inside the tub)
    const riserX = innerX + innerW - 16 * s; // near inner right wall
    const riserTopY = innerY - 200 * s; // height above rim
    const riserW = 10 * s;

    p.noStroke();
    p.fill(200);
    // vertical riser from rim up
    p.rect(
      riserX - riserW / 2,
      riserTopY,
      riserW,
      innerY - riserTopY + 4 * s,
      6 * s
    );

    // Move the head and stream slightly left from the riser
    const offsetIn = 80 * s; // how far to shift inward (left)
    let headCx = riserX - offsetIn;
    let headCy = riserTopY + 10 * s;
    let headW = 48 * s;
    let headH = 30 * s;

    // Connecting pipe from riser to head: horizontal arm + short vertical drop
    const armY = riserTopY + 6 * s; // arm height a bit below riser top for a clean elbow
    const armThick = 10 * s;

    // horizontal arm from riser to over the head
    p.rect(headCx, armY - armThick / 2, riserX - headCx, armThick, 5 * s);
    // short drop from arm to head
    p.rect(headCx - armThick / 2, armY, armThick, headCy - armY, 5 * s);

    // shower head (horizontal ellipse), bottom is the nozzle face
    p.fill(180);
    p.ellipse(headCx, headCy, headW, headH);
    p.fill(150);
    p.ellipse(headCx, headCy + headH * 0.06, headW * 0.78, headH * 0.62);

    // bottom nozzle holes (single row across underside)
    p.fill(110);
    let holes = 7;
    for (let i = 0; i < holes; i++) {
      let t = i / (holes - 1);
      let hx = p.lerp(headCx - headW * 0.32, headCx + headW * 0.32, t);
      let hy = headCy + headH * 0.32;
      p.ellipse(hx, hy, 3 * s, 3 * s);
    }

    // Single thicker stream: vertical, from head bottom to inside bottom of tub
    let streamW = 24 * s;
    let baseX = headCx;
    let baseY = headCy + headH * 0.35; // underside of head
    let targetX = baseX;
    let targetY = innerY + innerH - 2 * s; // bottom inside tub
    let length = p.max(0, targetY - baseY);

    // draw vertical stream (rounded rect)
    p.noStroke();
    // core
    if (running) {
      p.fill(58, 140, 220, 240);
      p.rect(baseX - streamW / 2, baseY, streamW, length, 10 * s);
    }

    // Overflow when ratio > 1.0 -> puddle and droplets (keep near right side)
    if (ratio > 1) {
      let overflowAmt = p.max(0, ratio - 1);

      // spill near right side
      let overflowX = x + tubW * 0.82;

      // puddle scaling
      let puddleMax = 160 * s;
      let puddleW = p.min(overflowAmt * puddleMax, puddleMax);
      let puddleH = puddleW * 0.34;
      let floorY = y + tubH + 10 * s;

      // fill + outline
      p.noStroke();
      p.fill(70, 150, 220, 170);
      p.ellipse(overflowX, floorY, puddleW, puddleH);
      p.noFill();
      p.stroke(35, 95, 160, 150);
      p.strokeWeight(2);
      p.ellipse(overflowX, floorY, puddleW, puddleH);
    }

    // restore stroke state
    p.noStroke();
  }

  p.windowResized = function () {
    p.resizeCanvas(800, 800);
  };
});
