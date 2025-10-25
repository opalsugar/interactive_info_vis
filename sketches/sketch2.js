// Instance-mode sketch for tab 2
registerSketch("sk2", function (p) {
  let startTime;
  let currentTaskIndex = 0;
  let tasks = [];
  let timerStarted = false;
  let nameInput, timeInput, addBtn, startBtn, nextTaskBtn;

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

    nextTaskBtn = p.createButton("Next Task");
    nextTaskBtn.size(100, 30);
    nextTaskBtn.position(10, 305);

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

    nextTaskBtn.mousePressed(() => {
      currentTaskIndex++;
      startTime = p.millis();
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
    p.textAlign(p.LEFT, p.BASELINE);
    p.rect(170, 30, 300, 720);
    p.text("Intended Plan", 270, 20);
    p.text("Actual Plan", 590, 20);

    // rectangles for each time interval, intended plan
    p.text("6am", 130, 40);
    p.rect(170, 30, 300, 90);
    p.rect(170, 120, 300, 90);

    p.text("7am", 130, 215);
    p.rect(170, 210, 300, 90);
    p.rect(170, 300, 300, 90);

    p.text("8am", 130, 395);
    p.rect(170, 390, 300, 90);
    p.rect(170, 480, 300, 90);

    p.text("9am", 130, 575);
    p.rect(170, 570, 300, 90);

    // actual plan rectangles
    p.rect(470, 30, 300, 720);
    p.rect(470, 30, 300, 90);
    p.rect(470, 120, 300, 90);
    p.rect(470, 210, 300, 90);
    p.rect(470, 300, 300, 90);
    p.rect(470, 390, 300, 90);
    p.rect(470, 480, 300, 90);
    p.rect(470, 570, 300, 90);

    // rects for tasks
    // 240 mins, each min is 3 pixels, 30 mins is 90 pixels
    // filling in incrementally
    let y = 30;
    p.noStroke();
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

    // border
    y = 30;
    tasks.forEach((task) => {
      p.stroke(task.color);
      p.strokeWeight(4);
      p.rect(170, y, 300, task.time * 3);
      p.noStroke();
      p.strokeWeight(1);
      p.fill("black");
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

    if (timerStarted && currentTime >= tasks[currentTaskIndex].time * 3) {
      currentTaskIndex++;
      startTime = p.millis();
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
