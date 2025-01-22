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

  // 下半球モデルをロード
  bottomCapsuleModel3D = loadModel('assets/models/sphere/half_hollow_sphere.obj', true, 
    () => console.log("Half-sphere model loaded successfully"),
    (err) => console.error("Error loading half-sphere model:", err)
  );

  // 半球モデル用のテクスチャ画像をロード
  textureSphereImg = loadImage('assets/textures/mapping.png', 
    () => console.log("Half-sphere texture loaded successfully"),
    (err) => console.error("Error loading half-sphere texture:", err)
  );


}

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

  // 上半球モデルの描画
  push();
  scale(1.7);
  translate(0, -50, 0); // Firemanモデルの上に配置
  if (textureSphereImg) {
    texture(textureSphereImg); // 半球モデルのテクスチャ適用
  }
  model(aboveCapsuleModel3D);
  pop();

  // 下半球モデルの描画
  push();
  scale(1.7);
  translate(0, 50, 0); // Firemanモデルの上に配置
  rotateX(PI); // モデルを上下反転
  if (textureSphereImg) {
    texture(textureSphereImg); // 半球モデルのテクスチャ適用
  }
  model(bottomCapsuleModel3D);
  pop();



}
