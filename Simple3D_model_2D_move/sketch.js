let model3D; // 3Dモデルを格納する変数
let textureImg; // テクスチャ画像を格納する変数

let start = { x: 0, y: -50, z: 0 }; // スタート位置
let goal = { x: 0, y: -100, z: -150 }; // ゴール位置
let startRotation = 0; // スタート時の回転角
let goalRotation = Math.PI / 2; // ゴール時の回転角
let t = 0; // アニメーションの進行度 (0から1まで)
let isOpening = false; // タップで開くフラグ

let shakeOffsetX = 0; // X方向の揺れオフセット
let shakeOffsetY = 0; // Y方向の揺れオフセット

function preload() {
  model3D = loadModel('assets/models/Fireman_0122044847_texture.obj', true);
  textureImg = loadImage('assets/textures/Fireman_0122044847_texture.png');
  aboveCapsuleModel3D = loadModel('assets/models/sphere/half_hollow_sphere.obj', true);
  textureSphereImg = loadImage('assets/textures/mapping.png');
  bottomCapsuleModel3D = loadModel('assets/models/sphere/half_hollow_sphere.obj', true);
}

function setup() {
  createCanvas(400, (400 / 9) * 16, WEBGL);
  camera(0, -400, 500, 0, 0, 0, 0, 1, 0);
}

function draw() {
  background(240);

  ambientLight(150);
  normalMaterial();
  pointLight(255, 255, 255, 100, 100, 100);

  // 原点を描画
  push();
  strokeWeight(5);
  stroke(255, 0, 0); line(0, 0, 0, 100, 0, 0);
  stroke(0, 255, 0); line(0, 0, 0, 0, 100, 0);
  stroke(0, 0, 255); line(0, 0, 0, 0, 0, 100);
  pop();

  orbitControl();

// 揺れの計算（タップしている間だけ）
if (mouseIsPressed) {
  shakeOffsetX = random(-2, 2); // X方向に-2から2のランダムな揺れ
  shakeOffsetY = random(-2, 2); // Y方向に-2から2のランダムな揺れ
  t = 0; // アニメーションを停止
} else if (isOpening && t < 1) {
  shakeOffsetX = 0;
  shakeOffsetY = 0;
  t += 0.01; // アニメーション速度を調整
}

  // アニメーションが有効な場合に進行
  if (isOpening && t < 1) {
    t += 0.01; // アニメーション速度を調整
  }

  // 現在位置を計算 (線形補間)
  let currentX = lerp(start.x, goal.x, t) + shakeOffsetX;
  let currentY = lerp(start.y, goal.y, t) + shakeOffsetY;
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
  if (textureSphereImg) {
    texture(textureSphereImg);
  }
  model(aboveCapsuleModel3D);
  pop();

  // 下半球モデルの描画 (固定)
  push();
  scale(1.7);
  translate(0, 50, 0); // 下半球モデルの位置調整
  rotateX(Math.PI); // 常に上下反転
  if (textureSphereImg) {
    texture(textureSphereImg);
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
  if (!isOpening && t === 0) {
    isOpening = true; // 開くフラグを有効化
  } else if (t >= 1) {
    isOpening = false; // リセット
    t = 0; // アニメーションをリセット
  }
}

