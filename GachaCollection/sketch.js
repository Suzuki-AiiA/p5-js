let isTouchDevice = false;
let backgroundImg, lever;
let capsuleRed, capsuleBlue, capsuleYellow;
let leverAngle = 0;
let isDragging = false;
let lastAngle = 0;
let centerX, centerY;
let scaleFactor = 0.6;
let angleOffset = 0;
let capsules = [];
let capsuleSize = 40;
let capsuleCount = 30;
let minX, maxX, minY, maxY;
let gravity = 0.2;
let groundY;
let friction = 0.97; // 摩擦係数

// 累積ドラッグ用変数
let accumulatedDragTime = 0; // ドラッグの合計時間
let dragStartTime = 0;       // ドラッグ開始時
let stopMovement = false; // 3秒経過後にtrueにして動きを止める

function preload() {
  backgroundImg = loadImage('images/background.png');
  lever = loadImage('images/lever.png');
  capsuleRed = loadImage('images/capsule_red2.png');
  capsuleBlue = loadImage('images/capsule_blue2.png');
  capsuleYellow = loadImage('images/capsule_yellow2.png');
}

function setup() {
  createCanvas(400, (400 / 9) * 16);

  isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  imageMode(CENTER);
  centerX = width / 2;
  centerY = height / 1.2;

  minX = 0;
  maxX = width;
  minY = 0;
  groundY = height / 2;

  for (let i = 0; i < capsuleCount; i++) {
    let capsuleImg = random([capsuleRed, capsuleBlue, capsuleYellow]);
    let newCapsule = {
      x: random(minX, maxX),
      y: random(minY, groundY - 30),
      img: capsuleImg,
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0
    };
    capsules.push(newCapsule);
  }
}

function draw() {
  image(backgroundImg, width / 2, height / 2, width, height);

  // ドラッグ中はカプセルをかき混ぜる
  if (isDragging) {
    mixCapsules();
  }

  updateCapsules();
  drawCapsules();

  push();
  translate(centerX, centerY);
  rotate(leverAngle);
  image(lever, 0, 0, lever.width * scaleFactor, lever.height * scaleFactor);
  pop();

  // 累計ドラッグ時間の算出
  let currentDragTime = accumulatedDragTime;
  if (isDragging) {
    currentDragTime += (millis() - dragStartTime);
  }

  // ドラッグ累計3秒以上
  if (currentDragTime > 1000) {
    console.log('ドラッグ合計時間が3秒を超えました。');
    // handleStopMovement();
  }
}

function updateCapsules() {
  for (let capsule of capsules) {
    capsule.vx += capsule.ax;
    capsule.vy += capsule.ay;
    capsule.vy += gravity;
    capsule.vx *= friction;
    capsule.vy *= friction;
    capsule.x += capsule.vx;
    capsule.y += capsule.vy;

    if (capsule.x - capsuleSize / 2 < minX) {
      capsule.x = minX + capsuleSize / 2 + 1;
      capsule.vx = abs(capsule.vx) > 0.5 ? -capsule.vx * 0.9 : 0;
    }
    if (capsule.x + capsuleSize / 2 > maxX) {
      capsule.x = maxX - capsuleSize / 2 - 1;
      capsule.vx = abs(capsule.vx) > 0.5 ? -capsule.vx * 0.9 : 0;
    }
    if (capsule.y - capsuleSize / 2 < minY) {
      capsule.y = minY + capsuleSize / 2 + 1;
      capsule.vy = abs(capsule.vy) > 0.5 ? -capsule.vy * 0.9 : 0;
    }
    if (capsule.y + capsuleSize / 2 > groundY) {
      capsule.y = groundY - capsuleSize / 2;
      capsule.vy = abs(capsule.vy) < 0.5 ? 0 : -capsule.vy * 0.5;
      capsule.ay = capsule.vy === 0 ? 0 : capsule.ay;
    }
  }

  resolveCollisions();
}

function drawCapsules() {
  for (let capsule of capsules) {
    image(capsule.img, capsule.x, capsule.y, capsuleSize, capsuleSize);
  }
}

function mixCapsules() {
  let force = sin(leverAngle) * 5;
  for (let capsule of capsules) {
    capsule.ax = force < 1.0 ? random(-force, force) : random(-1.5, 1.5);
    capsule.ay = force < 1.0 ? random(-force, force) : random(-1.5, 1.5);
  }
}

function resolveCollisions() {
  for (let i = 0; i < capsules.length; i++) {
    for (let j = i + 1; j < capsules.length; j++) {
      let dx = capsules[j].x - capsules[i].x;
      let dy = capsules[j].y - capsules[i].y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = capsuleSize;

      if (distance < minDist) {
        let angle = atan2(dy, dx);
        let overlap = minDist - distance;
        let pushX = cos(angle) * (overlap / 2);
        let pushY = sin(angle) * (overlap / 2);

        capsules[i].x -= pushX;
        capsules[i].y -= pushY;
        capsules[j].x += pushX;
        capsules[j].y += pushY;

        // 反発力を適用
        let tempVx = capsules[i].vx;
        let tempVy = capsules[i].vy;
        capsules[i].vx = capsules[j].vx;
        capsules[i].vy = capsules[j].vy;
        capsules[j].vx = tempVx;
        capsules[j].vy = tempVy;
      }
    }
  }
}

// カプセルを停止し、指定のカプセルを表示する関数
function handleStopMovement() {
  stopMovement = true;

  // すべてのカプセルの動きを停止
  for (let capsule of capsules) {
    capsule.vx = 0;
    capsule.vy = 0;
    capsule.ax = 0;
    capsule.ay = 0;
  }

  // 新たに1つのカプセルを表示（例：中央に capsuleBlue）
  // capsules = [];
  // let specialCapsule = {
  //   x: width / 2,
  //   y: height / 2 + 80,
  //   vx: 0,
  //   vy: 0,
  //   ax: 0,
  //   ay: 0,
  //   img: capsuleBlue
  // };
  image(capsuleRed, width / 2, height / 2 + 80, capsuleSize, capsuleSize);
  // capsules.push(specialCapsule);
}

function startDrag(x, y) {
  if (dist(x, y, centerX, centerY) < (lever.width * scaleFactor) / 2) {
    isDragging = true;
    dragStartTime = millis(); // ドラッグ開始時刻

    lastAngle = leverAngle;
    let initialAngle = atan2(y - centerY, x - centerX);
    angleOffset = lastAngle - initialAngle;
  }
}

function dragMove(x, y) {
  if (isDragging) {
    let newAngle = atan2(y - centerY, x - centerX);
    leverAngle = newAngle + angleOffset;
  }
}

function endDrag() {
  isDragging = false;
  // ドラッグ時間を累積
  accumulatedDragTime += (millis() - dragStartTime);
}

function mousePressed() { startDrag(mouseX, mouseY); }
function mouseDragged() { dragMove(mouseX, mouseY); }
function mouseReleased() { endDrag(); }
function touchStarted() { if (touches.length > 0) startDrag(touches[0].x, touches[0].y); }
function touchMoved() { if (touches.length > 0) dragMove(touches[0].x, touches[0].y); return false; }
function touchEnded() { endDrag(); }
