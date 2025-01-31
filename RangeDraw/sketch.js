let isTouchDevice = false; // タッチデバイスかどうかを保存

function setup() {
  createCanvas(400, 400 / 9 * 16); // 16:9の比率でキャンバスを作成
  background(240); // 初期背景色を設定
  isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0; // タッチデバイスかどうかを判定

}

function draw() {

}