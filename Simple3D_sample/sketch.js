let model3D; // 3Dモデルを格納する変数
let textureImg; // テクスチャ画像を格納する変数

let radius = (50 / sin(PI / 4)); // 円弧の半径 (約70.71)
let center = { x: 0, y: 0, z: -100 }; // 円弧の中心
let startAngle = 0; // スタート時の角度 (ラジアン)
let endAngle = PI / 2; // ゴール時の角度 (ラジアン)
var t = 0; // アニメーションの進行度 (0から1まで)

function drawCoordinates(thickness, length = 200, dotted = false) {
  push();
  strokeWeight(thickness);
  
  if (dotted) {
    drawingContext.setLineDash([5, 5]); // 点線のパターンを設定
  } else {
    drawingContext.setLineDash([]); // 実線
  }

  stroke(255, 0, 0); // X軸（赤）
  drawDottedLine(0, 0, 0, length, 0, 0);
  stroke(0, 255, 0); // Y軸（緑）
  drawDottedLine(0, 0, 0, 0, length, 0);
  stroke(0, 0, 255); // Z軸（青）
  drawDottedLine(0, 0, 0, 0, 0, length);
  
  pop();
}

function drawDottedLine(x1, y1, z1, x2, y2, z2, dotSpacing = 5) {
  let totalDist = dist(x1, y1, z1, x2, y2, z2);
  let steps = totalDist / dotSpacing;

  for (let i = 0; i < steps; i++) {
    let t = i / steps;
    let x = lerp(x1, x2, t);
    let y = lerp(y1, y2, t);
    let z = lerp(z1, z2, t);
    point(x, y, z); // 点を描画
  }
}

function setup() {
  createCanvas(400, (400 / 9) * 16, WEBGL);
  // クオータービューのカメラ設定
  let camX = 800; // カメラのX座標
  let camY = 800; // カメラのY座標
  let camZ = 800; // カメラのZ座標
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0); // カメラの設定
  t=0;
}

function draw() {
  background(240);
  // 照明設定
  ambientLight(150); // 環境光
  pointLight(255, 255, 255, 100, 100, 100); // 照明

  // 原点を描画
  drawCoordinates(4, 200, false);
  
  //操作可能に
  orbitControl();

  // 線を細く
  strokeWeight(1);

  push();
  stroke(255, 0, 0); // X軸（赤）
  translate(200, 0, 0);
  sphere(20); // 赤球
  pop();

  push();
  translate(100, 0, 0); // 座標系がX方向に100px移動
  drawCoordinates(2, 100, true); 

  rotateX(radians(360*t)); // 座標系がY軸を中心にtを使って回転
  drawCoordinates(1, 50, true);
  box(40); // 赤箱

  translate(0, 100, 0); // 100px地点で回転した座標系から座標系をY方向に100px移動   
  drawCoordinates(1, 100, true);
  box(20); // 赤箱

  translate(100, 0, 0); // 100px地点で回転した座標系でY方向に100px移動   
  drawCoordinates(1, 12, true);
  box(40); // 赤箱
  pop();//ここでリセット。座標系が元に戻る。

  push();
  stroke(0, 255, 0); // Y軸（緑）
  translate(0, 200, 0);
  sphere(20); // 緑球
  pop();

  push();
  stroke(0, 0, 255); // Z軸（青）
  translate(0, 0, 200);
  sphere(20); // 青球
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