let isTouchDevice = false; // タッチデバイスかどうかを保存

function setup() {
  createCanvas(400, 400 / 9 * 16); // 16:9の比率でキャンバスを作成
  background(240); // 初期背景色を設定

  // タッチデバイスかどうかを判定
  isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// マウスクリック時に画面を赤くする（タッチデバイスでは動作しない）
function mousePressed() {
  if (isTouchDevice) return; // タッチデバイスなら処理をスキップ
  background(255, 0, 0); // 背景を赤に変更
}

// マウスを離したときに背景を元の色に戻す
function mouseReleased() {
  if (isTouchDevice) return; // タッチデバイスなら処理をスキップ
  background(240); // 背景を元の色に戻す
}

// タッチ開始時に画面を赤くする
function touchStarted() {
  background(255, 0, 0); // 背景を赤に変更
}

// タッチを離したときに背景を元の色に戻す
function touchEnded() {
  background(240); // 背景を元の色に戻す
}