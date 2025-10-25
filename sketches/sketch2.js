// Instance-mode sketch for tab 2
registerSketch("sk2", function (p) {
  let startTime;
  let currentTaskIndex = 0;
  let tasks = [
    { task: "Wake Up", time: 30, color: "red" },
    { task: "Shower", time: 15, color: "blue" },
    { task: "Make Breakfast", time: 15, color: "green" },
  ];

  p.setup = function () {
    startTime = p.millis();
    p.createCanvas(800, 800);
  };

  p.clock = function () {
    let h = p.hour();
    let m = p.minute();
    let s = p.second();
  };

  p.draw = function () {
    p.background(220);

    // time setup
    let currentTime = p.floor((p.millis() - startTime) / 1000);
    console.log(currentTime);

    p.fill(0);
    p.noStroke();
    p.textSize(16);
    p.text(currentTime, 20, 30);

    // input boxes
    p.noFill();
    p.strokeWeight(1);
    p.stroke(0);
    p.rect(20, 50, 100, 30);
    p.rect(20, 100, 100, 30);
    p.rect(20, 150, 100, 30);

    // full rectangle
    p.rect(170, 10, 300, 720);

    // rectangles for each time interval, intended plan
    p.text("6am", 130, 20);
    p.rect(170, 10, 300, 90);
    p.rect(170, 100, 300, 90);

    p.text("7am", 130, 195);
    p.rect(170, 190, 300, 90);
    p.rect(170, 280, 300, 90);

    p.text("8am", 130, 375);
    p.rect(170, 370, 300, 90);
    p.rect(170, 460, 300, 90);

    p.text("9am", 130, 555);
    p.rect(170, 550, 300, 90);

    // actual plan rectangles
    p.rect(470, 10, 300, 720);
    p.rect(470, 10, 300, 90);
    p.rect(470, 100, 300, 90);
    p.rect(470, 190, 300, 90);
    p.rect(470, 280, 300, 90);
    p.rect(470, 370, 300, 90);
    p.rect(470, 460, 300, 90);
    p.rect(470, 550, 300, 90);

    // rects for tasks
    // 240 mins, each min is 3 pixels, 30 mins is 90 pixels
    let y = 10;
    tasks.forEach((task) => {
      p.stroke(task.color);
      p.strokeWeight(4);
      p.rect(170, y, 300, task.time * 3);
      y += task.time * 3;
      p.noStroke();
    });

    y = 10;
    tasks.forEach((task, idx) => {
      if (idx === currentTaskIndex) {
        console.log("idx", idx);
        let filledHeight = p.constrain(currentTime, 0, task.time * 3);
        p.fill(task.color);
        p.rect(170, y, 300, filledHeight);
      } else if (idx < currentTaskIndex) {
        p.fill(task.color);
        p.rect(170, y, 300, task.time * 3);
      }
      y += task.time * 3;
      p.noFill();
    });

    if (currentTime >= tasks[currentTaskIndex].time * 3) {
      currentTaskIndex++;
      startTime = p.millis();
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
