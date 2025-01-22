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
}

function setup() {
  createCanvas(400, (400 / 9) * 16, WEBGL);
}

function draw() {
  background(240);

  // 照明設定
  ambientLight(150); // 環境光
  pointLight(255, 255, 255, 100, 100, 100); // 照明

  // カメラ操作
  orbitControl();

  // モデルの描画
  push();
  scale(2);

  // モデルを上下反転
  rotateX(PI); // 上下反転（X軸で180度回転）
  
  // 回転アニメーション
  rotateY(frameCount * 0.01); // Y軸回転

  // テクスチャを適用
  if (textureImg) {
    texture(textureImg); // 通常のテクスチャ
  }

  model(model3D);
  pop();
}
