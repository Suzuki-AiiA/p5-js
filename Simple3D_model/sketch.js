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

// let radius = 50 / Math.sin(Math.PI / 4); // 円弧の半径
// let center = { x: 0, y: -50, z: 0 }; // 円の中心
// let goal = { x: 0, y: -100, z: -150 }; // 円の終点
let t = 0; // アニメーションの進行度 (0から1まで)


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

  // カメラ設定
  orbitControl();
// 上半球モデルの描画（特定の点を固定して回転）
  // アニメーションの進行
  if (t < 1) {
    t += 0.01; // アニメーション速度を調整
  }

  // 円の中心と半径
  const center = { x: 0, y: 0, z: -100 };
  const radius = 50 * Math.sqrt(5); // 円弧の半径

  // スタート地点とゴール地点の角度
  const startAngle = Math.atan2(-50 - center.y, 0 - center.z); // スタート角度
  const goalAngle = Math.atan2(-100 - center.y, -150 - center.z); // ゴール角度

  // 現在の角度を線形補間で計算
  const currentAngle = lerp(startAngle, goalAngle, t);

  // 現在の座標を計算 (yz平面上の円弧の軌跡)
  const currentX = center.x;
  const currentY = center.y + radius * Math.sin(currentAngle);
  const currentZ = center.z + radius * Math.cos(currentAngle);
  
  // 青丸を描画
  push();
  translate(currentX, currentY, currentZ);
  rotateX(currentAngle); // 回転を現在の角度に応じて適用
  fill(0, 0, 255);
  noStroke();
  sphere(5); // 青丸
  pop();

  console.log(currentX, currentY, currentZ, currentAngle);

  push();
  // 上半球モデルの描画
  scale(1.7);
  translate(currentX, currentY, currentZ);
  rotateX(currentAngle); // 回転を現在の角度に応じて適用
  
  // テクスチャを適用してモデルを描画
  if (textureSphereImg) {
    texture(textureSphereImg);
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


  
  // // Firemanモデルの描画
  // push();
  // scale(1.5);
  // translate(0, -5, 0); // Firemanモデルの上に配置
  // rotateX(PI); // モデルを上下反転
  // rotateY(frameCount * -0.001); // 回転アニメーション
  // if (textureImg) {
  //   texture(textureImg); // Firemanモデルのテクスチャ適用
  // }
  // model(model3D);
  // pop();
}

// リセット処理
function mousePressed() {
  t = 0; // アニメーション進行度をリセット
}
