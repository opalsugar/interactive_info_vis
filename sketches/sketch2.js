// Instance-mode sketch for tab 2
registerSketch("sk2", function (p) {
  let startTime;
  let currentTaskIndex = 0;
  let tasks = [];
  let timerStarted = false;
  let nameInput, timeInput, addBtn, startBtn, nextTaskBtn;
  let actualPlanHeights = [];

  const px_per_min = 3;

  p.setup = function () {
    p.createCanvas(800, 800);

    // defining input fields
    nameInput = p.createInput("");
    nameInput.position(10, 105);
    nameInput.size(100, 30);
    nameInput.attribute("placeholder", "Task Name");

    timeInput = p.createInput("");
    timeInput.position(10, 155);
    timeInput.size(100, 30);
    timeInput.attribute("placeholder", "Time (Minutes)");

    // defining buttons
    addBtn = p.createButton("Add");
    addBtn.size(100, 30);
    addBtn.position(10, 205);

    startBtn = p.createButton("Start");
    startBtn.size(100, 30);
    startBtn.position(10, 255);

    nextTaskBtn = p.createButton("Next Task");
    nextTaskBtn.size(100, 30);
    nextTaskBtn.position(10, 305);

    // button interactions
    // task is added to tasks array
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

    // starts timer and resets start time
    startBtn.mousePressed(() => {
      startTime = p.millis();
      timerStarted = true;
    });

    // moves to next task and resets start time
    nextTaskBtn.mousePressed(() => {
      currentTaskIndex++;
      startTime = p.millis();
    });
  };

  p.draw = function () {
    p.background(220);

    // time setup
    let currentTime = timerStarted
      ? p.floor((p.millis() - startTime) / 1000)
      : 0;
    let currentHeight = currentTime * px_per_min;

    // text
    p.stroke(0);
    p.strokeWeight(1);
    p.fill(0);
    p.textSize(16);
    p.textAlign(p.LEFT, p.BASELINE);
    p.text(currentTime, 20, 30);
    p.text("Intended Plan", 270, 20);
    p.text("Actual Plan", 590, 20);
    p.text("6am", 130, 40);
    p.text("7am", 130, 215);
    p.text("8am", 130, 395);
    p.text("9am", 130, 575);

    // resetting for rects
    p.noFill();
    p.strokeWeight(4);
    p.stroke(100);

    // full rectangle
    p.rect(170, 30, 300, 720);

    // intended plan rectangles
    p.rect(170, 30, 300, 90);
    p.rect(170, 120, 300, 90);
    p.rect(170, 210, 300, 90);
    p.rect(170, 300, 300, 90);
    p.rect(170, 390, 300, 90);
    p.rect(170, 480, 300, 90);
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

    /// INTENDED PLAN - left side
    // filling in of rectangles by minute increments y
    let yL = 30;
    p.noStroke();
    tasks.forEach((task, idx) => {
      let plannedHeight = task.time * px_per_min;
      if (timerStarted && idx === currentTaskIndex) {
        let plannedHeight = task.time * px_per_min;
        let filledHeight = p.constrain(currentTime, 0, plannedHeight);
        p.fill(task.color);
        p.rect(170, yL, 300, filledHeight);
      } else if (idx < currentTaskIndex) {
        p.fill(task.color);
        p.rect(170, yL, 300, plannedHeight);
      }
      yL += plannedHeight;
      p.noFill();
    });

    // borders and text for each task
    yL = 30;
    tasks.forEach((task) => {
      let plannedHeight = task.time * px_per_min;
      p.stroke(task.color);
      p.strokeWeight(4);
      p.rect(170, yL, 300, plannedHeight);
      p.noStroke();
      p.strokeWeight(1);
      p.fill("black");
      p.textAlign(p.CENTER, p.CENTER);
      p.text(
        task.task + " - " + task.time + " mins",
        320,
        yL + plannedHeight / 2
      );
      yL += plannedHeight;
      p.noFill();
      p.noStroke();
    });

    // COME BACK TO MAKE AUTO ADVANCE WORK FOR LEFT maybe?
    //   if (
    //     timerStarted &&
    //     currentTime >= tasks[currentTaskIndex].time * px_per_min
    //   ) {
    //     currentTaskIndex++;
    //     startTime = p.millis();
    //   }
    // };

    /// ACTUAL PLAN - right side
    yR = 30;
    tasks.forEach((task, idx) => {
      let plannedHeight = task.time * px_per_min;
      let actualHeight = 0;

      if (timerStarted && idx === currentTaskIndex) {
        actualHeight = currentHeight;
      }

      if (actualHeight > 0) {
        p.fill(task.color);
        p.rect(470, yR, 300, actualHeight);
        p.noFill();
      }

      let stackHeight;
      if (idx < currentTaskIndex) {
        stackHeight = actualHeight;
      } else if (idx === currentTaskIndex) {
        stackH = actualHeight;
      } else {
        stackHeight = plannedHeight;
      }

      yR += stackHeight;
    });

    // p.rect(470, y, 300, filledHeight); border
    // p.text(task.task + " - " + task.time + " mins", 620, y + (task.time * px_per_min) / 2); text

    p.windowResized = function () {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
  };
});
