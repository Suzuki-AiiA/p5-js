let model3D; // 3Dモデルを格納する変数
let textureImg; // テクスチャ画像を格納する変数


function preload() {
  // OBJファイルをロード
  model3D = loadModel('assets/models/Fireman_0122044847_texture.obj', true, 
    () => console.log("Model loaded successfully"),
    (err) => console.error("Error loading model:", err)
  );

  // テクスチャ画像をロード
  textureImg = loadImage('assets/textures/Fireman_0122044847_texture.png', 
    () => console.log("Texture loaded successfully"),
    (err) => console.error("Error loading texture:", err)
  );
  // 上半球モデルをロード
  aboveCapsuleModel3D = loadModel('assets/models/sphere/half_hollow_sphere.obj', true, 
    () => console.log("Half-sphere model loaded successfully"),
    (err) => console.error("Error loading half-sphere model:", err)
  );

  // 半球モデル用のテクスチャ画像をロード
  textureSphereImg = loadImage('assets/textures/mapping.png', 
    () => console.log("Half-sphere texture loaded successfully"),
    (err) => console.error("Error loading half-sphere texture:", err)
  );

    // 下半球モデルをロード
    bottomCapsuleModel3D = loadModel('assets/models/sphere/half_hollow_sphere.obj', true, 
      () => console.log("Half-sphere model loaded successfully"),
      (err) => console.error("Error loading half-sphere model:", err)
    );
}

let openAngle = 0; // 上半球の開き具合（角度）

function setup() {
  createCanvas(400, (400 / 9) * 16, WEBGL);
  devtexture = loadImage('assets/pokeBall.png', () => {
    console.log("devtexture loaded successfully");
  }, (err) => {
    console.error("Error loading devtexture:", err);
  });
}

function draw() {
  background(240);

  // 照明設定
  ambientLight(150); // 環境光
  pointLight(255, 255, 255, 100, 100, 100); // 照明

  normalMaterial();
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
  
  // カメラ操作
  orbitControl();

  // Firemanモデルの描画
  push();
  scale(1.5);
  translate(0, -5, 0); // Firemanモデルの上に配置
  rotateX(PI); // モデルを上下反転
  rotateY(frameCount * -0.001); // 回転アニメーション
  if (textureImg) {
    texture(textureImg); // Firemanモデルのテクスチャ適用
  }
  model(model3D);
  pop();

// 上半球モデルの描画（特定の点を固定して回転）
push();
scale(1.7);

// 1. 回転中心を固定したい点に移動
translate(0, -50, -50); // 回転中心を球の底部に設定

// 2. 回転を適用
rotateX(openAngle); // X軸で回転

// 3. 元の位置に戻す
translate(0, 50, 50); // 元の位置に戻す

// 回転中心を青丸で表示
push();
fill(0, 0, 255);
noStroke();
sphere(5); // 青丸
pop();



// テクスチャとモデルの描画
if (textureSphereImg) {
  texture(textureSphereImg); // 半球モデルのテクスチャ適用
}
model(aboveCapsuleModel3D);
pop();


  // 下半球モデルの描画
  push();
  scale(1.7);
  translate(0, 50, 0); // 下半球モデルの位置調整
  rotateX(PI); // モデルを上下反転
  if (textureSphereImg) {
    texture(textureSphereImg); // 下半球モデルのテクスチャ適用
  }
  model(bottomCapsuleModel3D);
  pop();

  // 開き角度の制御
  if (openAngle < PI / 2) { // 最大で90度まで開く
    openAngle += 0.01; // 徐々に角度を増やす
  }
}

// リセット処理
function mousePressed() {
  openAngle = 0; // 上半球の開き具合をリセット
}
