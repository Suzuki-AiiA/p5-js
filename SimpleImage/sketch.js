let isTouchDevice = false; // タッチデバイスかどうかを保存
let showImage = false; // 画像を表示するかどうかのフラグ
let capsuleImage; // 画像を保存する変数

function setup() {
  createCanvas(400, 400 / 9 * 16); // 16:9の比率でキャンバスを作成
  background(240); // 初期背景色を設定

  // タッチデバイスかどうかを判定
  isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // 画像を事前に読み込む
  capsuleImage = loadImage("images/capsule.png");
  // 画像の描画モードを中心に設定
  imageMode(CENTER);
}

function draw() {
  background(240); // 画面をリセット
  if (showImage) {
    // 画像をキャンバスの中心に表示
    image(capsuleImage, width / 2, height / 2);
  }
}

// マウスクリック時に画像を表示
function mousePressed() {
  if (isTouchDevice) return; // タッチデバイスなら処理をスキップ
  showImage = true; // 画像を表示するフラグをオン
}

// マウスリリース時に画像を非表示
function mouseReleased() {
  if (isTouchDevice) return; // タッチデバイスなら処理をスキップ
  showImage = false; // 画像を表示するフラグをオフ
}

// タッチ開始時に画像を表示
function touchStarted() {
  showImage = true; // 画像を表示するフラグをオン
}

// タッチ終了時に画像を非表示
function touchEnded() {
  showImage = false; // 画像を表示するフラグをオフ
}