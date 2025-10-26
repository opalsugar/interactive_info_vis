// Instance-mode sketch for tab 2
registerSketch("sk2", function (p) {
  let startTime;
  let currentTaskIndex = 0;
  let tasks = [];
  let timerStarted = false;
  let nameInput, timeInput, addBtn, startBtn, nextTaskBtn;
  let currentTime, currentHeight;

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
      let taskName = nameInput.value().trim();
      let taskTime = parseInt(timeInput.value());
      let taskColor = p.color(
        p.random(75, 255),
        p.random(75, 255),
        p.random(75, 255)
      );

      if (taskName === "" || isNaN(taskTime) || taskTime <= 0) {
        console.log("Invalid input. Please enter a valid task name and time.");
        return;
      }

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
      tasks[currentTaskIndex].actualHeight = currentHeight;
      console.log(tasks);
      currentTaskIndex++;
      startTime = p.millis();
    });
  };

  p.draw = function () {
    p.background(220);

    // time setup
    currentTime = timerStarted ? p.floor((p.millis() - startTime) / 60000) : 0;
    currentHeight = currentTime * px_per_min;

    // text
    p.stroke(0);
    p.strokeWeight(1);
    p.fill(0);
    p.textSize(16);
    p.textAlign(p.LEFT, p.BASELINE);
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
    let yL = 32;
    p.noStroke();
    tasks.forEach((task, idx) => {
      let plannedHeight = task.time * px_per_min;
      if (timerStarted && idx === currentTaskIndex) {
        let plannedHeight = task.time * px_per_min;
        let filledHeight = p.constrain(currentHeight, 0, plannedHeight);
        p.fill(task.color);
        p.rect(171, yL, 296, filledHeight);
      } else if (idx < currentTaskIndex) {
        p.fill(task.color);
        p.rect(171, yL, 296, plannedHeight);
      }
      yL += plannedHeight;
      p.noFill();
    });

    // borders and text for each task
    yL = 32;
    tasks.forEach((task) => {
      let plannedHeight = task.time * px_per_min;
      p.stroke(task.color);
      p.rect(171, yL, 296, plannedHeight);
      p.noStroke();
      p.strokeWeight(4);
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

    /// ACTUAL PLAN - right side
    yR = 30;
    tasks.forEach((task, idx) => {
      p.fill(task.color);
      if (timerStarted && idx === currentTaskIndex) {
        p.rect(471, yR, 300, currentHeight);
      } else if (idx < currentTaskIndex) {
        p.rect(471, yR, 300, task.actualHeight);
        console.log("height", task.actualHeight);
      }

      yR += task.actualHeight;
      p.noFill();
    });

    // borders and text
    yR = 32;
    tasks.forEach((task, idx) => {
      let plannedHeight = task.time * px_per_min;
      let borderHeight = 0;

      if (timerStarted && idx === currentTaskIndex) {
        if (currentHeight > plannedHeight) {
          // over time
          borderHeight = currentHeight;
        } else {
          // under or equal time
          borderHeight = plannedHeight;
        }
      } else if (idx < currentTaskIndex) {
        borderHeight = task.actualHeight;
      } else {
        // future task
        borderHeight = plannedHeight;
      }

      p.stroke(task.color);
      p.rect(471, yR, 300, borderHeight);
      yR += borderHeight;
      p.noFill();
      p.noStroke();
    });

    p.windowResized = function () {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
  };
});
