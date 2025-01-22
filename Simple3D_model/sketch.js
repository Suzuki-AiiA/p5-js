let model3D; // 3Dモデルを格納する変数
let textureImg; // テクスチャ画像を格納する変数
let debugGrid; // デバッグ用テクスチャ

function preload() {
  // デバッグ用グリッドテクスチャ
  debugGrid = loadImage('assets/textures/debug_grid.png');

  // MTLファイルの手動解析
  parseMTL('assets/models/Fireman_0122044847_texture.mtl');

  // OBJファイルをロード
  model3D = loadModel('assets/models/Fireman_0122044847_texture.obj', true, 
    () => console.log("Model loaded successfully"),
    (err) => console.error("Error loading model:", err)
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

  // マテリアル設定（グリッド表示の消去）
  normalMaterial();

  // モデルの描画
  push();

  // 原点マーカー
  fill(255,0,0);
  noStroke();
  sphere(10);
  pop();

  scale(2);
  translate(0, 0, 0); // 必要に応じて調整
  // モデルを上下反転
  rotateX(PI); // 上下反転（X軸で180度回転）
  // rotateX(frameCount * 0.01);
  rotateY(frameCount * -0.01);

  // テクスチャを適用
  if (textureImg) {
    texture(textureImg); // 通常のテクスチャ
  } else {
    texture(debugGrid); // デバッグ用グリッド
  }

  // デバッグ用ログ
  if (frameCount % 60 === 0) {
    console.log("Rendering frame:", frameCount);
    console.log("Model:", model3D);
    console.log("Texture:", textureImg);
  }

  model(model3D);
  pop();
}

// MTLファイルの解析関数
function parseMTL(filePath) {
  loadStrings(filePath, (lines) => {
    for (let line of lines) {
      const parts = line.trim().split(/\s+/);

      // map_Kdがテクスチャパスを指定している行を解析
      if (parts[0] === 'map_Kd') {
        const texturePath = 'assets/textures/' + parts[1];
        console.log('Texture path:', texturePath);

        // テクスチャをロード
        textureImg = loadImage(texturePath, () => {
          console.log('Texture loaded successfully:', texturePath);
        }, (err) => {
          console.error('Failed to load texture:', texturePath, err);
        });
      }
    }
  });
}
