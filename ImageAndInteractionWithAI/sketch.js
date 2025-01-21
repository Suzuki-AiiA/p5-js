let frontTexture;
let backTexture;
let backlineTexture;
let capOpenSE;
let capCloseSE;
let haikei;
let isPressed = false;
let isTouchDevice = false; // タッチデバイスかどうかを判定する変数
let startY = 0; // ドラッグ開始位置
let shakeOffsetX = 0; // X軸の揺れオフセット
let shakeOffsetY = 0; // Y軸の揺れオフセット
let capOpened = false; // キャップが開いた状態

// let itemTexture; // アイテム画像
let itemTextures = []; // 画像を格納する配列
let probabilities = [0.4, 0.4, 0.2]; // 各画像の出現確率（合計 1.0）
let selectedItemIndex = -1; // 選択された画像のインデックス

let itemVisible = false; // アイテムが表示される状態
let particles = []; // パーティクルを管理する配列
let gravity = 0.05; // 重力加速度（数値を調整して重力感を変えられる）

let imageWidth = 100; // 初期の幅
let imageHeight = 100; // 初期の高さ
let maxImageSize = 250; // 最大サイズ
let zoomSpeed = 4; // ズームインの速度



let particleEmitters = [
  { x: 50, y: 400 }, // カプセル左側
  { x: 350, y: 400 }  // カプセル右側
];


class Particle {
  constructor(x, y) {
    this.x = x; // 初期X座標
    this.y = y; // 初期Y座標
    this.vx = random(-2, 2); // X方向の速度
    this.vy = random(-5, -1); // Y方向の速度
    this.size = random(5, 10); // パーティクルのサイズ
    this.alpha = 255; // パーティクルの透明度（寿命の管理に使用）
    this.color = color(random(255), random(255), random(255)); // ランダムな色
  }

  update() {
    this.x += this.vx; // X座標を更新
    this.y += this.vy; // Y座標を更新
    this.vy += gravity; // 重力を適用してY方向の速度を増加
    this.alpha -= 3; // 透明度を減少（消えるアニメーション）
  }

  draw() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.alpha);
    ellipse(this.x, this.y, this.size);
  }

  isDead() {
    return this.alpha <= 2; // aplhaが2以下になったら寿命
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
  // 各画像を読み込む
  itemTextures.push(loadImage('images/character/fireman.png'));
  itemTextures.push(loadImage('images/character/police.png'));
  itemTextures.push(loadImage('images/character/military.png'));

  // サウンドの設定
  capOpenSE.setVolume(0.5);
  capCloseSE.setVolume(0.5);

  isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

}


function draw() {
  // 背景描画
  if (haikei) {
    image(haikei, width / 2, height / 2, width, height);
  } else {
    background('skyblue');
  }

  // 振動を適用する（タップ中に常に振動）
  if (isPressed && !capOpened) {
    shakeOffsetX = random(-5, 5);
    shakeOffsetY = random(-5, 5);
  } else {
    shakeOffsetX = 0;
    shakeOffsetY = 0;
  }

  // 揺れを適用する
  let backX = 200 + (isPressed && !capOpened ? shakeOffsetX : 0);
  let backY = 400 + (isPressed && !capOpened ? shakeOffsetY : 0);
  let frontX = 200 + (isPressed && !capOpened ? shakeOffsetX : 0);
  let frontY = capOpened ? 200 : 400;
  frontY += isPressed && !capOpened ? shakeOffsetY : 0;

  // カプセルの下半分のテクスチャ
  image(backTexture, backX, backY);

  // アイテムを表示
  if (itemVisible && selectedItemIndex !== -1) {
    if (imageWidth < maxImageSize) {
      imageWidth += zoomSpeed; // 幅を拡大
      imageHeight += zoomSpeed; // 高さを拡大
    }

    // ズームインされたサイズで画像を描画
    image(itemTextures[selectedItemIndex], 200, 350, imageWidth, imageHeight);  }

  // パーティクルの描画と更新
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();

    // 寿命が尽きたパーティクルを配列から削除
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }

  image(backlineTexture, 200, 400);
  image(frontTexture, frontX, frontY);
}


function selectRandomItem() {
  let r = random(); // 0.0 以上 1.0 未満の乱数を生成
  let cumulativeProbability = 0;

  for (let i = 0; i < probabilities.length; i++) {
    cumulativeProbability += probabilities[i];
    if (r < cumulativeProbability) {
      return i; // 確率に一致する画像のインデックスを返す
    }
  }

  return probabilities.length - 1; // 保険として最後の画像を返す
}





// マウス操作
function mousePressed() {
  if (!isTouchDevice) {
    startInteraction(mouseY); // 押下処理を開始
  }
}

function mouseDragged() {
  if (!isTouchDevice) {
    handleDrag(mouseY); // ドラッグ処理
  }
}

function mouseReleased() {
  if (!isTouchDevice) {
    endInteraction(); // 押下処理を終了
  }
}

// タッチ操作
function touchStarted() {
  if (isTouchDevice) {
    startInteraction(touches[0].y); // 押下処理を開始
  }
  return false; // デフォルト動作を防ぐ
}

function touchMoved() {
  if (isTouchDevice) {
    handleDrag(touches[0].y); // ドラッグ処理
  }
  return false; // デフォルト動作を防ぐ
}

function touchEnded() {
  if (isTouchDevice) {
    endInteraction(); // 押下処理を終了
  }
  return false; // デフォルト動作を防ぐ
}

// 共通の押下処理
function startInteraction(y) {
  isPressed = true;
  startY = y; // 押下時のY座標を記録
}

// 共通のドラッグ処理
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

    // キャップを開ける条件
    if (!capOpened && dragDistance > 100 && currentY < height / 2) {
      capOpenSE.play();
      capOpened = true;
      shakeOffsetX = 0;
      shakeOffsetY = 0;

      // アイテムを選択
      selectedItemIndex = selectRandomItem();
      itemVisible = true; // アイテムを表示

      // ズームアニメーションの初期化
      imageWidth = 100;
      imageHeight = 100;

     // パーティクルを生成
     // 複数の発生位置からパーティクルを生成
    for (let emitter of particleEmitters) {
      let count = random(150, 200); // ランダムなパーティクル数
      for (let i = 0; i < count; i++) { // 各位置から20個のパーティクルを生成
        particles.push(new Particle(emitter.x, emitter.y));
      }
    }
    }

    // キャップを閉じる条件
    if (capOpened && dragDistance < -100) {
      capCloseSE.play();
      capOpened = false;
      shakeOffsetX = 0;
      shakeOffsetY = 0;
      itemVisible = false; // アイテムを隠す
      itemY = 400; // アイテム位置をリセット
    }
  }
}


// 共通の押下終了処理
function endInteraction() {
  isPressed = false; // 押下状態を終了
  shakeOffsetX = 0; // 揺れをリセット
  shakeOffsetY = 0; // 揺れをリセット
}