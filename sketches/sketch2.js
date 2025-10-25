// Instance-mode sketch for tab 2
registerSketch("sk2", function (p) {
  let startTime;
  let currentTaskIndex = 0;
  let tasks = [];
  let timerStarted = false;

  p.setup = function () {
    p.createCanvas(800, 800);

    nameInput = p.createInput("");
    nameInput.position(10, 105);
    nameInput.size(100, 30);
    nameInput.attribute("placeholder", "Task Name");

    timeInput = p.createInput("");
    timeInput.position(10, 155);
    timeInput.size(100, 30);
    timeInput.attribute("placeholder", "Time (Minutes)");

    addBtn = p.createButton("Add");
    addBtn.size(100, 30);
    addBtn.position(10, 205);

    startBtn = p.createButton("Start");
    startBtn.size(100, 30);
    startBtn.position(10, 255);

    addBtn.mousePressed(() => {
      let taskName = nameInput.value();
      let taskTime = parseInt(timeInput.value());
      let taskColor = p.color(
        p.random(75, 255),
        p.random(75, 255),
        p.random(75, 255)
      );

      // if (taskName === "" || isNaN(taskTime) || taskTime <= 0) {
      //   p.text("", 400, 50);
      //   p.text(
      //     "Invalid input. Please enter a valid task name and time.",
      //     400,
      //     50
      //   );
      //   return;
      // } else {
      //   p.text("", 400, 50);
      // }

      tasks.push({ task: taskName, time: taskTime, color: taskColor });

      nameInput.value("");
      timeInput.value("");

      p.redraw();

      console.log(tasks);
    });

    startBtn.mousePressed(() => {
      startTime = p.millis();
      timerStarted = true;
    });
  };

  p.clock = function () {
    let h = p.hour();
    let m = p.minute();
    let s = p.second();
  };

  p.draw = function () {
    p.background(220);

    // time setup
    let currentTime = timerStarted
      ? p.floor((p.millis() - startTime) / 1000)
      : 0;
    console.log(currentTime);

    p.fill(0);
    p.noStroke();
    p.textSize(16);
    p.text(currentTime, 20, 30);
    p.noFill();
    p.strokeWeight(1);
    p.stroke(0);

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
      p.strokeWeight(1);
      p.fill(task.color);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(
        task.task + " - " + task.time + " mins",
        320,
        y + (task.time * 3) / 2
      );
      p.noFill();
      y += task.time * 3;
      p.noStroke();
    });

    y = 10;
    tasks.forEach((task, idx) => {
      if (timerStarted) {
        if (idx === currentTaskIndex) {
          let filledHeight = p.constrain(currentTime, 0, task.time * 3);
          p.fill(task.color);
          p.rect(170, y, 300, filledHeight);
        } else if (idx < currentTaskIndex) {
          p.fill(task.color);
          p.rect(170, y, 300, task.time * 3);
        }
        y += task.time * 3;
        p.noFill();
      }
    });

    if (timerStarted && currentTime >= tasks[currentTaskIndex].time * 3) {
      currentTaskIndex++;
      startTime = p.millis();
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
