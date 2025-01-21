let isTouchDevice = false; // タッチデバイスかどうかを保存
let targetColor; // 現在のターゲット背景色
let currentColor; // 現在の背景色

function setup() {
  createCanvas(400, 400 / 9 * 16); // 16:9の比率でキャンバスを作成
  currentColor = color(240); // 初期背景色を設定
  targetColor = currentColor; // 初期のターゲット色も同じに設定
  background(currentColor); // 初期背景色を適用

  // タッチデバイスかどうかを判定
  isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function draw() {
  // 現在の色をターゲット色に徐々に近づける
  currentColor = lerpColor(currentColor, targetColor, 0.05); // 補間率を調整
  background(currentColor); // 背景色を更新
}

// マウスクリック時に画面を赤くする（タッチデバイスでは動作しない）
function mousePressed() {
  if (isTouchDevice) return; // タッチデバイスなら処理をスキップ
  currentColor = color(255, 0, 0); // 背景を即座に赤に設定
  targetColor = currentColor; // ターゲット色も同じに設定
}

// マウスを離したときに背景を元の色に戻す
function mouseReleased() {
  if (isTouchDevice) return; // タッチデバイスなら処理をスキップ
  targetColor = color(240); // 背景を元の色に戻す
}

// タッチ開始時に画面を赤くする
function touchStarted() {
  currentColor = color(255, 0, 0); // 背景を即座に赤に設定
  targetColor = currentColor; // ターゲット色も同じに設定
}

// タッチを離したときに背景を元の色に戻す
function touchEnded() {
  targetColor = color(240); // 背景を元の色に戻す
}