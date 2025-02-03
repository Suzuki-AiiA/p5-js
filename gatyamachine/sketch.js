let isTouchDevice = false; // タッチデバイスかどうかを保存
let bgImage; // 背景画像を格納する変数
let pushImage; // pushボタン画像を格納する変数
let cupImage; // cupblue画像を格納する変数
let firemanImage; // fireman画像を格納する変数
let showCup = false; // cupblueを表示するかどうか
let cupY = 450; // cupblueの開始位置（下から上へ移動）
let cupSize = 40; // cupblueの開始サイズ
let animationProgress = 0; // アニメーションの進行度
let animationPhase = 0; // アニメーションフェーズの管理
let waitTime = 0; // アニメーションフェーズ間の待機時間

// 表示位置とサイズを調整できるパラメータ（グローバル変数）
let pushX = 80; // X座標
let pushY = 600; // Y座標
let pushWidth = 250; // 幅
let pushHeight = 60; // 高さ

function preload() {
  bgImage = loadImage("images/gatyamachine3.png"); // 背景画像を読み込む
  pushImage = loadImage("images/push.png"); // pushボタン画像を読み込む
  cupImage = loadImage("images/cupblue.png"); // cupblue画像を読み込む
  firemanImage = loadImage("images/fireman.png"); // fireman画像を読み込む
}

function setup() {
  createCanvas(400, (400 / 9) * 16); // 16:9の比率でキャンバスを作成
  isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0; // タッチデバイスかどうかを判定

  showCup = false; // 初期状態をリセット
  animationProgress = 0; // アニメーションのリセット
  animationPhase = 0; // アニメーションフェーズのリセット
  waitTime = 0; // 待機時間のリセット
}

function draw() {
  image(bgImage, 0, 0, width, height); // 毎フレーム背景を描画
  image(pushImage, pushX, pushY, pushWidth, pushHeight); // 毎フレーム pushボタンを描画
  
  if (showCup) {
    if (animationPhase === 0) {
      // 収縮フェーズ（40 → 30）
      cupSize = lerp(40, 30, animationProgress);
      animationProgress += 0.2;
      if (animationProgress >= 1) {
        animationProgress = 0;
        animationPhase = 1;
      }
    } else if (animationPhase === 1) {
      // 拡大フェーズ（30 → 90）
      cupSize = lerp(30, 90, animationProgress);
      cupY = lerp(350, 250, animationProgress);
      animationProgress += 0.2;
      if (animationProgress >= 1) {
        animationProgress = 0;
        animationPhase = 1.5; // 一時的なフェーズ
        waitTime = millis(); // 現在の時間を保存
      }
    } else if (animationPhase === 1.5) {
      // 1秒待機中は cupSize を 90 に固定
      cupSize = 90; 
      if (millis() - waitTime >= 500) {
        animationProgress = 0; // 次のフェーズが始まる直前にリセット
        cupSize = 90; // ここで明示的にサイズをセット
        animationPhase = 2;
      }
    } else if (animationPhase === 2) {
      // 徐々に250%（90 → 100）
      cupSize = lerp(90, 250, animationProgress);
      animationProgress += 0.05;
      if (animationProgress >= 1) {
        animationProgress = 1; // 拡大し続けるのを防ぐ
      }
    }
    
    // X座標をカプセルサイズの変化に応じて調整
    let cupX = 150 - (cupSize - 90) / 2;
    image(cupImage, cupX, cupY, cupSize, cupSize); // cupblueをアニメーションで表示
  }
}

function handlePress(x, y) {
  if (y < height / 4) { // 画面上部をタップしたらリセット
    setup();
  } else if (x > pushX && x < pushX + pushWidth && y > pushY && y < pushY + pushHeight) {
    showCup = true;
    animationProgress = 0; // アニメーションをリセット
    animationPhase = 0; // アニメーションフェーズをリセット
    waitTime = 0; // 待機時間のリセット
  }
}

function mousePressed() {
  handlePress(mouseX, mouseY);
}

function touchStarted() {
  if (touches.length > 0) {
    handlePress(touches[0].x, touches[0].y);
  }
  return false; // デフォルトのタッチ動作を防ぐ
}

function touchEnded(event) {
  event.preventDefault();
  return false;
}
