// Instance-mode sketch for tab 4
registerSketch("sk4", function (p) {
  // 0.0 = empty, 1.0 = at rim, >1.0 = overflow
  let fillRatio = 5; // change this manually for now; later you can map time -> fillRatio

  p.draw = function () {
    p.background(245);

    // center and scale
    let cx = p.width / 2;
    let cy = p.height / 2 + 40;
    let s = 1.0;

    drawBathtub(cx, cy, s, fillRatio);
  };

  // Draw a bathtub with water and incremental overflow
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
    p.ellipse(cx, cy + tubH * 0.58, tubW * 0.9, wall * 4);

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
    let inRatio = ratio;
    if (inRatio < 0) {
      inRatio = 0;
    }
    if (inRatio > 1) {
      inRatio = 1;
    }

    // water fill inside the tub
    let waterH = innerH * inRatio;
    let waterY = innerY + (innerH - waterH);

    if (waterH > 0) {
      // water
      p.noStroke();
      p.fill(70, 150, 220);
      p.rect(innerX, waterY, innerW, waterH, rimR * 0.55, rimR * 0.55, 6, 6);

      // subtle meniscus highlight
      if (waterH > 8 * s) {
        p.fill(90, 170, 240);
        p.rect(innerX, waterY, innerW, 8 * s, rimR * 0.5, rimR * 0.5, 3, 3);
      }
    }

    // re-draw rim on top of water edges
    p.noFill();
    p.stroke(40);
    p.strokeWeight(2);
    p.rect(x, y, tubW, tubH, rimR);

    // faucet/spout (simple)
    let spoutX = x + tubW * 0.15;
    let spoutY = y - 18 * s;
    p.noStroke();
    p.fill(210);
    p.rect(spoutX, spoutY, 60 * s, 18 * s, 6 * s);
    p.rect(spoutX + 48 * s, spoutY + 8 * s, 12 * s, 26 * s, 6 * s);
    p.fill(180);
    p.rect(spoutX + 48 * s, y - 10 * s, 12 * s, 8 * s, 3 * s);

    // feet
    let footW = 28 * s;
    let footH = 18 * s;
    p.fill(225);
    p.noStroke();
    p.rect(x + 42 * s, y + tubH - footH, footW, footH, 6 * s);
    p.rect(x + tubW - 42 * s - footW, y + tubH - footH, footW, footH, 6 * s);

    // overflow when ratio > 1.0
    if (ratio > 1) {
      let overflowAmt = ratio - 1;
      if (overflowAmt < 0) {
        overflowAmt = 0;
      }

      // Spill point (pushed slightly right so it's clearly visible)
      let rimTopY = y + wall; // inner rim top
      let overflowX = x + tubW * 0.82; // right side spill

      // Stream and puddle scaling
      let streamMax = 180 * s;
      let puddleMax = 160 * s;

      // Stream height grows with overflow
      let streamH = overflowAmt * streamMax;
      if (streamH > streamMax) {
        streamH = streamMax;
      }

      // Thicker, more opaque stream core; nudge up to overlap rim line
      let streamW = 28 * s;
      p.noStroke();
      p.fill(58, 140, 220, 235);
      p.rect(
        overflowX - streamW / 2,
        rimTopY - 2 * s,
        streamW,
        streamH + 2 * s,
        10 * s
      );

      // Bright highlight stripe on the left edge of the stream
      p.fill(120, 195, 255, 180);
      p.rect(
        overflowX - streamW * 0.45,
        rimTopY - 2 * s,
        streamW * 0.18,
        streamH + 2 * s,
        8 * s
      );

      // Soft edge outline for the stream to separate it from the tub
      p.noFill();
      p.stroke(35, 95, 160, 160);
      p.strokeWeight(2);
      p.rect(
        overflowX - streamW / 2,
        rimTopY - 2 * s,
        streamW,
        streamH + 2 * s,
        10 * s
      );

      // Foam at the rim to make the start of the stream obvious
      p.noStroke();
      p.fill(255, 255, 255, 210);
      let f = 0;
      let foamN = 6;
      while (f < foamN) {
        let fx = overflowX + (f - foamN / 2) * 6 * s;
        let fy = rimTopY - 6 * s + (f % 2) * 2 * s;
        let fr = 8 * s - f * 0.6 * s;
        p.ellipse(fx, fy, fr, fr * 0.9);
        f = f + 1;
      }

      // Puddle with outline for contrast
      let puddleW = overflowAmt * puddleMax;
      if (puddleW > puddleMax) {
        puddleW = puddleMax;
      }
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

      // Bigger droplets along the stream
      p.noStroke();
      let i = 0;
      let dotCount = 5;
      while (i < dotCount) {
        let dx = (i - 2) * 12 * s;
        let dy = 24 * s + i * 16 * s;
        let r = 6 * s + i * 1.2 * s;
        if (streamH > dy) {
          p.fill(120, 195, 255, 210);
          p.ellipse(overflowX + dx, rimTopY + dy, r, r * 1.25);
        }
        i = i + 1;
      }
    }

    // subtle rim highlight
    p.noFill();
    p.stroke(255, 255, 255, 130);
    p.strokeWeight(3);
    p.arc(cx, y + 2 * s, tubW - 12 * s, rimR * 2.4, p.PI, 0);

    // restore stroke state
    p.noStroke();
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
