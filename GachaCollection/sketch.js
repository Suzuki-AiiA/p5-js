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
let capsuleSize = 60;
let minX, maxX, minY, maxY;
let gravity = 0.2;
let groundY;

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

  minX = width / 3;
  maxX = (width / 3) * 2;
  minY = height / 6;
  groundY = height / 2;

  // カプセルを5個ランダムに配置
  for (let i = 0; i < 5; i++) {
    let capsuleImg = random([capsuleRed, capsuleBlue, capsuleYellow]);
    let newCapsule = {
      x: random(minX, maxX),
      y: random(minY, groundY - 30), // groundYより少し上に配置
      img: capsuleImg,
      vx: 0,
      vy: 0
    };
    capsules.push(newCapsule);
  }

  isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  imageMode(CENTER);
  centerX = width / 2;
  centerY = height / 1.2;

  minX = width / 3;
  maxX = (width / 3) * 2;
  minY = height / 6;
  groundY = height / 2;
}

function draw() {
  image(backgroundImg, width / 2, height / 2, width, height);

  if (isDragging) {
    mixCapsules();
  }

  for (let capsule of capsules) {
    image(capsule.img, capsule.x, capsule.y, capsuleSize, capsuleSize);
  }

  push();
  translate(centerX, centerY);
  rotate(leverAngle);
  image(lever, 0, 0, lever.width * scaleFactor, lever.height * scaleFactor);
  pop();
}

function startDrag(x, y) {
  if (dist(x, y, centerX, centerY) < (lever.width * scaleFactor) / 2) {
    isDragging = true;
    lastAngle = leverAngle;
    let initialAngle = atan2(y - centerY, x - centerX);
    angleOffset = lastAngle - initialAngle;
  }
}

function dragMove(x, y) {
  if (isDragging) {
    let newAngle = atan2(y - centerY, x - centerX);
    leverAngle = newAngle + angleOffset;
    mixCapsules();
  }
}

function endDrag() {
  isDragging = false;
}

function mixCapsules() {
  for (let capsule of capsules) {
    capsule.vx = random(-2, 2);
    capsule.vy = random(-2, 2);
    capsule.x = constrain(capsule.x + capsule.vx, minX, maxX);
    capsule.vy += gravity;
    capsule.y = constrain(capsule.y + capsule.vy, minY, groundY);
  }
}

function mousePressed() { startDrag(mouseX, mouseY); }
function mouseDragged() { dragMove(mouseX, mouseY); }
function mouseReleased() { endDrag(); }
function touchStarted() { if (touches.length > 0) startDrag(touches[0].x, touches[0].y); }
function touchMoved() { if (touches.length > 0) dragMove(touches[0].x, touches[0].y); return false; }
function touchEnded() { endDrag(); }
