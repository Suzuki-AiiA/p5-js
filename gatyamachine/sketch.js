let isTouchDevice = false; // タッチデバイスかどうかを保存
let bgImage; // 背景画像を格納する変数
let pushImage; // pushボタン画像を格納する変数
let cupImage; // cupblue画像を格納する変数
let showCup = false; // cupblueを表示するかどうか
let cupY = 450; // cupblueの開始位置（下から上へ移動）
let cupSize = 40; // cupblueの開始サイズ
let animationProgress = 0; // アニメーションの進行度

// 表示位置とサイズを調整できるパラメータ（グローバル変数）
let pushX = 80; // X座標
let pushY = 600; // Y座標
let pushWidth = 250; // 幅
let pushHeight = 60; // 高さ

function preload() {
  bgImage = loadImage("gatyamachine3.png"); // 背景画像を読み込む
  pushImage = loadImage("push.png"); // pushボタン画像を読み込む
  cupImage = loadImage("cupblue.png"); // cupblue画像を読み込む
}

function setup() {
  createCanvas(400, (400 / 9) * 16); // 16:9の比率でキャンバスを作成
  isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0; // タッチデバイスかどうかを判定

  showCup = false; // 初期状態をリセット
  animationProgress = 0; // アニメーションのリセット
}

function draw() {
  image(bgImage, 0, 0, width, height); // 毎フレーム背景を描画
  image(pushImage, pushX, pushY, pushWidth, pushHeight); // 毎フレーム pushボタンを描画
  
  if (showCup && animationProgress < 1) {
    animationProgress += 0.2; // アニメーションの進行速度
    cupY = lerp(450, 250, animationProgress); // 下から上へ移動
    cupSize = lerp(40, 90, animationProgress); // サイズを大きくする
  }
  
  if (showCup) {
    image(cupImage, 150, cupY, cupSize, cupSize); // cupblueをアニメーションで表示
  }
}

function mousePressed() {
  if (mouseY < height / 4) { // 画面上部をタップしたらリセット
    setup();
  } else if (mouseX > pushX && mouseX < pushX + pushWidth && mouseY > pushY && mouseY < pushY + pushHeight) {
    showCup = true;
    animationProgress = 0; // アニメーションをリセット
  }
}
