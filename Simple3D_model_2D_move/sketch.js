let isTouchDevice = false; // タッチデバイスかどうかを保存する変数

let model3D; // 3Dモデルを格納する変数
let textureImg; // テクスチャ画像を格納する変数
let backgroundImg; // 背景画像を格納する変数
let textureAboveSphereImg; // テクスチャ画像を格納する変数
let textureBottomSphereImg; // テクスチャ画像を格納する変数
let startX, startY, dragDistance, t = 0, maxDistance = 200;
let sensitivity = 0.1; // 感度を調整 (1が標準、2で倍速、0.5で半分)
let mobilesensitivity = 5.5; // 感度を調整 (1が標準、2で倍速、0.5で半分)

let start = { x: 0, y: -50, z: 0 }; // スタート位置
let goal = { x: 0, y: -100, z: -150 }; // ゴール位置
let startRotation = 0; // スタート時の回転角
let goalRotation = Math.PI / 2; // ゴール時の回転角
let isOpening = false; // タップで開くフラグ

let shakeOffsetX = 0; // X方向の揺れオフセット
let shakeOffsetY = 0; // Y方向の揺れオフセット

function preload() {
  model3D = loadModel('assets/models/Fireman_0122044847_texture.obj', true);
  textureImg = loadImage('assets/textures/Fireman_0122044847_texture.png');
  aboveCapsuleModel3D = loadModel('assets/models/sphere/half_hollow_sphere.obj', true);
  textureAboveSphereImg = loadImage('assets/textures/pokeBallAbove.png');
  textureBottomSphereImg = loadImage('assets/textures/pokeBallBottom.png');

  bottomCapsuleModel3D = loadModel('assets/models/sphere/half_hollow_sphere.obj', true);
  backgroundImg  = loadImage('assets/images/background.png');
}

function setup() {
  createCanvas(400, (400 / 9) * 16, WEBGL);
  camera(0, -400, 600, 0, 0, 0, 0, 1, 0);

    // タッチデバイスかどうかを判定
  isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  let canvas = document.querySelector('canvas');
  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault(); // デフォルトのスクロールを防止
  }, { passive: false });

  canvas.addEventListener('touchmove', function(e) {
    e.preventDefault(); // デフォルトのスクロールを防止
  }, { passive: false });
}

function draw() {
  // 背景画像を描画
  background(50,176,80); //赤,緑,青
  
  ambientLight(300);
  normalMaterial();
  pointLight(255, 255, 255, 100, 100, 100);

  // 原点を描画
  push();
  strokeWeight(5);
  stroke(255, 0, 0); line(0, 0, 0, 100, 0, 0); // X軸　赤
  stroke(0, 255, 0); line(0, 0, 0, 0, 100, 0); // Y軸　緑
  stroke(0, 0, 255); line(0, 0, 0, 0, 0, 100); // Z軸　青
  pop();

  // orbitControl();

// 揺れの計算（タップしている間だけ）
if (mouseIsPressed) {
  shakeOffsetX = random(-2, 2); // X方向に-2から2のランダムな揺れ
  shakeOffsetY = random(-2, 2); // Y方向に-2から2のランダムな揺れ
} else {
  shakeOffsetX = 0;
  shakeOffsetY = 0;
}

  // アニメーションが有効な場合に進行
  if (isOpening && t < 1) {
    t += 0.01; // アニメーション速度を調整
  }

  // 現在位置を計算 (線形補間)
  let currentX = lerp(start.x, goal.x, t);
  let currentY = lerp(start.y, goal.y, t);
  let currentZ = lerp(start.z, goal.z, t);

  // 現在の回転角度を計算
  let currentRotation = lerp(startRotation, goalRotation, t);

  // 上半球モデルの描画
  push();
  scale(1.7);
  // 現在位置に移動
  translate(currentX, currentY, currentZ);
  // 回転を適用
  rotateX(currentRotation);

  // テクスチャを適用してモデルを描画
  if (textureAboveSphereImg) {
    texture(textureAboveSphereImg);
  }
  model(aboveCapsuleModel3D);
  pop();

  // 下半球モデルの描画 (固定)
  push();
  scale(1.7);
  translate(shakeOffsetX, 50, 0); // 揺れオフセットを追加
  rotateX(Math.PI); // 常に上下反転
  if (textureBottomSphereImg) {
    texture(textureBottomSphereImg);
  }
  model(bottomCapsuleModel3D);
  pop();


  
  // // Firemanモデルの描画
  push();
  scale(1.2);
  translate(0, -5, 0); // Firemanモデルの上に配置
  rotateX(PI + PI / 8); // モデルを上下反転
  rotateY(PI + frameCount * -0.03); // 回転アニメーション
  if (textureImg) {
    texture(textureImg); // Firemanモデルのテクスチャ適用
  }
  model(model3D);
  pop();
}

function mousePressed() {
  startX = mouseX; // スワイプの開始位置を記録
  startY = mouseY;
}
function mouseDragged() {
  let dx = mouseX - startX; // X方向のドラッグ距離
  let dy = mouseY - startY; // Y方向のドラッグ距離

  // Y方向のドラッグに基づいて t を更新 (dy > 0 で閉じる、dy < 0 で開く)
  let deltaT = (dy / maxDistance) * sensitivity; // 感度を調整
  if (Math.abs(deltaT) > 0.05) { // 急激な変化を制限
    deltaT = 0.05 * Math.sign(deltaT); // 最大値を0.05に制限
  }

  t -= deltaT; // t を更新
  t = constrain(t, 0, 1); // t を 0 ～ 1 の範囲に制限

  // 現在の t 値をログに出力 (デバッグ用)
  console.log("Drag Y:", dy, "t value:", t);

  // ドラッグ終了位置を更新
  startX = mouseX;
  startY = mouseY;
}

function mouseReleased() {
  // スワイプ終了後、tに基づいてモデルを調整
}


function touchStarted() {
  startX = touches[0].x; // touches[0] で最初のタッチ位置を取得
  startY = touches[0].y;
  return false;

}
function touchMoved() {
  console.log("Touch moved:", touchX, touchY); // 現在のタッチ位置をログ出力

  let dx = touches[0].x - startX; // X方向のスワイプ距離
  let dy = touches[0].y - startY; // Y方向のスワイプ距離

  let deltaT = (dy / maxDistance) * mobilesensitivity;
  if (Math.abs(deltaT) > 0.05) {
    deltaT = 0.05 * Math.sign(deltaT);
  }

  t -= deltaT;
  t = constrain(t, 0, 1);

  console.log("Touch Move Y:", dy, "t value:", t);

  startX = touches[0].x;
  startY = touches[0].y;

  return false;
}


function touchEnded() {
  // 必要に応じてタッチ終了後の処理を記述
  return false; // デフォルトのブラウザ動作を防止
}
