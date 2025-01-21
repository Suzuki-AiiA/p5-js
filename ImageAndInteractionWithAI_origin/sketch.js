let frontTexture;
let backTexture;
let capOpenSE;
let capCloseSE;
let isPressed = false;
let isTouchDevice = false; // タッチデバイスかどうかを判定する変数
let startY = 0; // ドラッグ開始位置
let shakeOffsetX = 0; // X軸の揺れオフセット
let shakeOffsetY = 0; // Y軸の揺れオフセット
let capOpened = false; // キャップが開いた状態

function setup() {
  createCanvas(400, 400 / 9 * 16); // 16:9の比率でキャンバスを作成
  imageMode(CENTER);
  frontTexture = loadImage('images/front.png');
  backTexture = loadImage('images/back.png');
  capOpenSE = loadSound('sounds/openCap.mp3');
  capCloseSE = loadSound('sounds/capClose.mp3');
  capOpenSE.volume = 0.5;
  capCloseSE.volume = 0.5;

  // タッチデバイスかどうかを判定
  isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function draw() {
  background('skyblue');

  // 揺れを適用する
  let backX = 200 + (isPressed && !capOpened ? shakeOffsetX : 0);
  let backY = 400 + (isPressed && !capOpened ? shakeOffsetY : 0);
  let frontX = 200 + (isPressed && !capOpened ? shakeOffsetX : 0);
  let frontY = capOpened ? 300 : 400;
  frontY += isPressed && !capOpened ? shakeOffsetY : 0;

  // 背景テクスチャを描画
  image(backTexture, backX, backY);

  // フロントテクスチャを描画
  image(frontTexture, frontX, frontY);
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
    // 下方向への移動では震えない
    if (currentY < startY) {
      // ドラッグ中の揺れをランダムに設定
      shakeOffsetX = random(-5, 5); // X軸方向に -5 ~ 5 の揺れ
      shakeOffsetY = random(-5, 5); // Y軸方向に -5 ~ 5 の揺れ
    } else {
      shakeOffsetX = 0; // 下方向では揺れを停止
      shakeOffsetY = 0; // 下方向では揺れを停止
    }

    // ドラッグ量を計算
    let dragDistance = startY - currentY;

    // キャップを開ける条件
    if (!capOpened && dragDistance > 100 && currentY < height / 2) {
      capOpenSE.play(); // 効果音を再生
      capOpened = true; // キャップを開いた状態に変更
      shakeOffsetX = 0; // 揺れを停止
      shakeOffsetY = 0; // 揺れを停止
    }

    // キャップを閉じる条件
    if (capOpened && dragDistance < -100) {
      capCloseSE.play(); // キャップを閉じる効果音を再生
      capOpened = false; // キャップを閉じた状態に変更
      shakeOffsetX = 0; // 揺れを停止
      shakeOffsetY = 0; // 揺れを停止
    }
  }
}

// 共通の押下終了処理
function endInteraction() {
  isPressed = false; // 押下状態を終了
  shakeOffsetX = 0; // 揺れをリセット
  shakeOffsetY = 0; // 揺れをリセット
}