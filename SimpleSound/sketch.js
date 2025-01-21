let isTouchDevice = false; // タッチデバイスかどうかを保存
let soundEffect; // 音声を保存する変数

function preload() {
  // 音声ファイルを事前に読み込む
  soundEffect = loadSound("sounds/se.mp3"); // 適切な音声ファイルのパスを指定してください
	soundEffect.volume =　0.5;
}

function setup() {
  createCanvas(400, 400 / 9 * 16); // 16:9の比率でキャンバスを作成
  background(240); // 初期背景色を設定

  // タッチデバイスかどうかを判定
  isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function draw() {
  // 描画は不要なので何もしません
}

// マウスクリック時に音を再生
function mousePressed() {
  if (isTouchDevice) return; // タッチデバイスなら処理をスキップ
  soundEffect.play(); // 音声を再生
}

// タッチ開始時に音を再生
function touchStarted() {
  soundEffect.play(); // 音声を再生
}