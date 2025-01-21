let frontTexture;　//蓋のテクスチャ
let backTexture;
let backlineTexture;
let frontAlpha = 255; // frontTextureの初期の透明度
let alphaDecreaseRate = 10; // タップごとに減少する透明度の量

let capOpenSE;
let capCloseSE;
let haikei; //背景用の変数として用意
let isPressed = false;
let isTouchDevice = false; // タッチデバイスかどうかを判定する変数
let startY = 0; // ドラッグ開始位置
let shakeOffsetX = 0; // X軸の揺れオフセット
let shakeOffsetY = 0; // Y軸の揺れオフセット
let capOpened = false; // キャップが開いた状態

let itemTextures = []; // 画像を格納する配列
let probabilities = [0.4, 0.4, 0.2]; // 各画像の出現確率（合計 1.0）
let selectedItemIndex = -1; // 選択された画像のインデックス

let itemVisible = false; // アイテムが表示される状態
let particles = []; // パーティクルを管理する配列
let gravity = 0.05; // 重力加速度

let imageWidth = 100; // 初期の幅
let imageHeight = 100; // 初期の高さ
let maxImageSize = 250; // 最大サイズ
let zoomSpeed = 4; // ズームインの速度

let particleEmitters = [
  { x: 50, y: 400 }, // カプセル左側
  { x: 350, y: 400 } // カプセル右側
];

// パーティクルクラス
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);
    this.vy = random(-5, -1);
    this.size = random(5, 10);
    this.alpha = 255;
    this.color = color(random(255), random(255), random(255));
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += gravity;
    this.alpha -= 3;
  }

  draw() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.alpha);
    ellipse(this.x, this.y, this.size);
  }

  isDead() {
    return this.alpha <= 2;
  }
}

function setup() {
  createCanvas(400, 400 / 9 * 16); // 16:9の比率でキャンバスを作成
  imageMode(CENTER);
  frontTexture = loadImage('images/front.png');
  backTexture = loadImage('images/back.png');
  backlineTexture = loadImage('images/backline.png');
  capOpenSE = loadSound('sounds/openCap.mp3');
  capCloseSE = loadSound('sounds/capClose.mp3');
  haikei = loadImage('images/background.png');

  itemTextures.push(loadImage('images/character/fireman.png'));
  itemTextures.push(loadImage('images/character/police.png'));
  itemTextures.push(loadImage('images/character/military.png'));

  capOpenSE.setVolume(0.5);
  capCloseSE.setVolume(0.5);

  isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function draw() {
  if (haikei) {
    image(haikei, width / 2, height / 2, width, height);
  } else {
    background('skyblue');
  }

  if (isPressed) {
    shakeOffsetX = random(-5, 5);
    shakeOffsetY = random(-5, 5);

    if (frontAlpha > 0) {
      frontAlpha -= alphaDecreaseRate * 0.1;
      frontAlpha = max(frontAlpha, 0);
      console.log("frontAlpha (decreasing):", frontAlpha); // デバッグ用
    }
  } else {
    shakeOffsetX = 0;
    shakeOffsetY = 0;
  }

  let backX = 200 + shakeOffsetX;
  let backY = 400 + shakeOffsetY;
  let frontX = 200 + shakeOffsetX;
  let frontY = capOpened ? 200 : 400;

  image(backTexture, backX, backY);
  image(backlineTexture, 200, 400);

  // 透明度を適用してfrontTextureを描画
  tint(255, frontAlpha);
  image(frontTexture, frontX, frontY);
  noTint();

  console.log("isPressed:", isPressed); // デバッグ用
}

function selectRandomItem() {
  let r = random();
  let cumulativeProbability = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumulativeProbability += probabilities[i];
    if (r < cumulativeProbability) {
      return i;
    }
  }
  return probabilities.length - 1;
}

function mousePressed() {
  if (!isTouchDevice) {
    startInteraction(mouseY);
  }
}

function mouseDragged() {
  if (!isTouchDevice) {
    handleDrag(mouseY);
  }
}

function mouseReleased() {
  if (!isTouchDevice) {
    endInteraction();
  }
}

function touchStarted() {
  if (isTouchDevice) {
    startInteraction(touches[0].y);
  }
  return false;
}

function touchMoved() {
  if (isTouchDevice) {
    handleDrag(touches[0].y);
  }
  return false;
}

function touchEnded() {
  if (isTouchDevice) {
    endInteraction();
  }
  return false;
}

function startInteraction(y) {
  isPressed = true;
  startY = y;
  if (frontAlpha > 0) {
    frontAlpha -= alphaDecreaseRate;
    frontAlpha = max(frontAlpha, 0);
  }
}

function handleDrag(currentY) {
  if (isPressed) {
    if (currentY < startY) {
      shakeOffsetX = random(-5, 5);
      shakeOffsetY = random(-5, 5);
    } else {
      shakeOffsetX = 0;
      shakeOffsetY = 0;
    }
    let dragDistance = startY - currentY;
    if (!capOpened && dragDistance > 100 && currentY < height / 2) {
      capOpenSE.play();
      capOpened = true;
      frontAlpha = 255;
      selectedItemIndex = selectRandomItem();
      itemVisible = true;
      imageWidth = 100;
      imageHeight = 100;
      for (let emitter of particleEmitters) {
        let count = random(150, 200);
        for (let i = 0; i < count; i++) {
          particles.push(new Particle(emitter.x, emitter.y));
        }
      }
    }
    if (capOpened && dragDistance < -100) {
      capCloseSE.play();
      capOpened = false;
      itemVisible = false;
      frontAlpha = 255;
    }
  }
}

function endInteraction() {
  isPressed = false;
  shakeOffsetX = 0;
  shakeOffsetY = 0;
  if (frontAlpha < 255) {
    frontAlpha = min(frontAlpha + 5, 255);
  }
}