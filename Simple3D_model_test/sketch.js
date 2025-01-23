let model3D; // 3Dモデルを格納する変数
let textureImg; // テクスチャ画像を格納する変数

let radius = (50 / sin(PI / 4)); // 円弧の半径 (約70.71)
let center = { x: 0, y: 0, z: -100 }; // 円弧の中心
let startAngle = 0; // スタート時の角度 (ラジアン)
let endAngle = PI / 2; // ゴール時の角度 (ラジアン)
var t = 0; // アニメーションの進行度 (0から1まで)


function setup() {
  createCanvas(400, (400 / 9) * 16, WEBGL);
}

function draw() {
  background(240);
  // 照明設定
  ambientLight(150); // 環境光
  pointLight(255, 255, 255, 100, 100, 100); // 照明
    // 原点を描画
  push();
  strokeWeight(5);
  stroke(255, 0, 0); // X軸（赤）
  line(0, 0, 0, 100, 0, 0);
  stroke(0, 255, 0); // Y軸（緑）
  line(0, 0, 0, 0, 100, 0);
  stroke(0, 0, 255); // Z軸（青）
  line(0, 0, 0, 0, 0, 100);
  pop();
  orbitControl();

    // 中心点に青丸を描画
  push();
  fill(0, 0, 255);
  noStroke();
  sphere(5); // 青丸
  pop();

  // アニメーションの進行
  if (t < 1) {
    t += 0.01; // アニメーション速度を調整
  }
}

// リセット処理
function mousePressed() {
  t = 0; // アニメーション進行度をリセット
}
