let isTouchDevice = false; // タッチデバイスかどうかを保存
let bgImage; // 背景画像を格納する変数
let pushImage; // pushボタン画像を格納する変数
let cupImage; // cupblue画像を格納する変数
let cupTopImage; // cupblue 上半分の画像を格納する変数
let cupBottomImage; // cupblue 下半分の画像を格納する変数
let firemanImage; // fireman画像を格納する変数
let mititarymanImage; // mititaryman画像を格納する変数
let showCup = false; // cupblueを表示するかどうか
let cupY = 450; // cupblueの開始位置（下から上へ移動）
let cupSize = 40; // cupblueの開始サイズ
let animationProgress = 0; // アニメーションの進行度
let animationPhase = 0; // アニメーションフェーズの管理
let waitTime = 0; // アニメーションフェーズ間の待機時間
let showbutton = true; // ボタンを表示するかどうか
let cupSplit = false; // カプセルを分割するかどうかのフラグ
let startSwipeY = null; // スワイプ開始位置
let isSwiping = false; // スワイプ状態フラグ
let isTapping = false; // タップ状態フラグ
let capsuleOpened = false; // カプセルが開いたかどうかのフラグ
let swipeThreshold = 300; // スワイプ開封の閾値
let cupTopOffsetY = 0; // カプセル上部のY座標オフセット
let mobileoffset = 0; // モバイル端末のオフセット
let characterModelImage; // キャラクターモデルの画像
let randomCharacter = 0; // ランダムに選ばれたキャラクター

let shakeOffsetX = 0; // シェイクのオフセットX
let shakeX = 0; // シェイクのX座標
let shearY = 0; // シェイクのY座標

// 表示位置とサイズを調整できるパラメータ（グローバル変数）
let pushWidth = 250; // 幅
let pushHeight = 60; // 高さ
let pushX; // setup() で初期化 // 中央基準で左端のX座標を求める // 中央基準で左端のX座標を求める
let pushY = 600; // Y座標

// 既存のグローバル変数群の後ろに、パーティクル用の変数を追加
let particles = [];  // パーティクルの配列

// パーティクルクラス（x, y成分を個別にランダム化）
class Particle {
  constructor(x, y,r,g,b) {
    this.x = x;
    this.y = y;
    // 直線（光のビーム）の長さ（見た目の長さ）
    this.length = random(20, 50);
    // vx, vy をそれぞれ独立に乱数で設定（極座標方式は使わない）
    this.vx = random(-6, 6);
    this.vy = random(-6, 6);
    // 速度ベクトルから描画用の角度を算出
    this.angle = atan2(this.vy, this.vx);
    // 色は黄色系、アルファは固定または後で lifetime により変化させる
    this.color = color(r, g, b, 200);
    // ここでは lifetime を設定。ずっと光る場合は lifetime の減衰を緩やかにするか固定にする
    this.lifetime = 255;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    this.lifetime -= 10; // 2ずつ減らす（適宜調整）
  }

  draw() {
    push();
    translate(this.x, this.y);
    // 直線をその移動方向に合わせて回転
    rotate(this.angle);
    noFill();
    // strokeWeight を調整して光の太さを決める
    strokeWeight(3);
    // 色も lifetime に応じて調整できる（今回は固定のまま）
    stroke(this.color);
    // (0,0) から (length, 0) まで直線を描く
    line(0, 0, this.length, 0);
    pop();
  }

  isAlive() {
    // ずっと光っているイメージなら、常に true を返すか、
    // 必要に応じて lifetime の条件で判定します。
    return this.lifetime > 0;
  }
}

function preload() {
  bgImage = loadImage("images/gatyamachine4.png"); // 背景画像を読み込む
  pushImage = loadImage("images/push.png"); // pushボタン画像を読み込む
  cupImage = loadImage("images/cupblue.png"); // cupblue画像を読み込む
  cupTopImage = loadImage("images/cupblueup.png"); // cupblue 上半分の画像を読み込む
  cupTopImage2 = loadImage("images/cupblueup2.png"); // cupblue 上半分の画像を読み込む
  cupBottomImage = loadImage("images/cupbluebot.png"); // cupblue 下半分の画像を読み込む
  cupBottomImage2 = loadImage("images/cupbluebot2.png"); // cupblue 下半分の画像を読み込む
  firemanImage = loadImage("images/character/fireman.png"); // fireman画像を読み込む
  policemanImage = loadImage("images/character/police.png"); // policeman画像を読み込む
  mititarymanImage = loadImage("images/character/military.png"); // mititaryman画像を読み込む
}

function setup() {
  randomCharacter = random(1); // 0から1の間でランダムな数値を生成
  pushX = width / 2 - pushWidth / 2; // `width` が定義された後に計算
  createCanvas(400, (400 / 9) * 16); // 16:9の比率でキャンバスを作成
  imageMode(CENTER); // 画像の描画基準を中央に設定
  isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0; // タッチデバイスかどうかを判定

  // 画面サイズに応じたスワイプしきい値を設定（例：キャンバスの高さの10%をしきい値に）
  if (isTouchDevice) {
    swipeThreshold = height * 0.1; // 例: 高さの10%
  } else {
    swipeThreshold = 300; // PC用は固定値
  }

  showCup = false; // 初期状態をリセット
  animationProgress = 0; // アニメーションのリセット
  animationPhase = 0; // アニメーションフェーズのリセット
  waitTime = 0; // 待機時間のリセット
  cupSplit = false; // カプセルを分割しない状態
  capsuleOpened = false; // ここでリセットする
  isSwiping = false;
  isTapping = false;
  showbutton = true; // ボタンを表示する

  // パーティクル配列をクリア（リセット時にパーティクルを強制停止）
  particles = [];
}

function draw() {
  push();
  tint(0,0,0, 200); // 画像の透明度をリセット
  image(bgImage, width / 2, height / 2, width, height); // 毎フレーム背景を描画
  pop();


  if(showbutton){
    image(bgImage, width / 2, height / 2, width, height); // 毎フレーム背景を描画
    image(pushImage, width / 2, pushY, pushWidth, pushHeight); // 毎フレーム pushボタンを描画
  }

  // ★カプセルが開いたら、パーティクルを生成＆描画する
  if (capsuleOpened) {
    // カプセルの中心（ここでは width/2, cupY）を基準にパーティクルを生成
    for (let i = 0; i < 5; i++) {
      if (randomCharacter < 0.8) {
        particles.push(new Particle(width / 2, cupY - 50, 255, 204, 0)); // ここでパーティクルを生成
      }
      else {
        particles.push(new Particle(width / 2, cupY - 50, random(255), random(255), random(255))); // ここでパーティクルを生成
      }
    }
  }
  // 各パーティクルの更新と描画、寿命切れの削除
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw(); // display() → draw() に変更
    if (!particles[i].isAlive()) { // isDead() → !isAlive() に変更
      particles.splice(i, 1);
    }
  }


  if (showCup) {
    if (animationPhase === 0) {
      cupSize = lerp(40, 30, animationProgress);
      animationProgress += 0.2;
      if (animationProgress >= 1) {
        animationProgress = 0;
        animationPhase = 1;
      }
    } else if (animationPhase === 1) {
      cupSize = lerp(30, 90, animationProgress);
      cupY = lerp(400, 250, animationProgress);
      animationProgress += 0.2;
      if (animationProgress >= 1) {
        animationProgress = 0;
        animationPhase = 1.5;
        waitTime = millis();
      }
    } else if (animationPhase === 1.5) {
      showbutton = false;
      cupY = 250; // ✅ ここで明示的に `startY` をセット
      cupSize = 90;
      if (millis() - waitTime >= 500) {
        animationProgress = 0;
        cupSize = 90;
        animationPhase = 2;
      }
    } else if (animationPhase === 2) {
      
      let startY = 250; // animationPhase === 1.5 のときの最終位置
      let targetY = 500; // 拡大後の目標位置
      let sizeProgress = lerp(90, 250, animationProgress);
      let centerOffset = (sizeProgress - 90) / 2; // 90からの増加分の半分を調整
      cupY = startY + (targetY - startY) * animationProgress - centerOffset;
      cupSize = sizeProgress;
      animationProgress += 0.05;
      if (animationProgress >= 1) {
        animationProgress = 1;
        isSwiping = true; // スワイプを有効化
        cupSplit = true; // 拡大アニメーションが完了したらカプセルを分割
      }
    }
    
    let cupX = width / 2;
    let cupHeight = (cupBottomImage.height / cupBottomImage.width) * cupSize; // 画像の縦横比を維持
    let cupCenterY = cupY;
    
    if (cupSplit) {
      let shakeX = (animationPhase === 2 && isTapping) ? random(-2, 2) : 0;
      let shakeY = (animationPhase === 2 && isTapping) ? random(-2, 2) : 0;

      if(!capsuleOpened){


        image(cupBottomImage, cupX + shakeX, cupCenterY + shakeY, cupSize, cupSize);
        image(cupTopImage, cupX + shakeX, cupCenterY + shakeY, cupSize, cupSize);
      }
      // ここでカプセルが開いた場合に firemanImage を表示
      if (capsuleOpened) {
        image(cupBottomImage, cupX + shakeX, cupCenterY + shakeY, cupSize, cupSize);
        image(cupTopImage2, cupX + shakeX, cupCenterY + shakeY + cupTopOffsetY, cupSize, cupSize);

        // 例として、カプセルの上部中央に firemanImage を表示
        // firemanImage のサイズや位置は適宜調整してください
        // ランダムに選ばれたキャラが出現するように変更

        if (randomCharacter < 0.3) {
          characterModelImage = firemanImage;
        } else if(randomCharacter >= 0.3 && randomCharacter < 0.8) {
          characterModelImage = policemanImage;
        }
          else {
          characterModelImage = mititarymanImage;
        }

        image(characterModelImage, cupX, cupCenterY - cupSize / 4, cupSize, cupSize);
        image(cupTopImage2, cupX + shakeX, cupCenterY + shakeY + cupTopOffsetY, cupSize, cupSize);
        image(cupBottomImage2, cupX + shakeX, cupCenterY + shakeY, cupSize, cupSize);
      }
    }else {
      image(cupImage, cupX, cupY, cupSize, cupSize);
    }
  }

}

function handlePress(x, y) {
  if (y < height / 8 && animationPhase < 2) { 
    setup();
  }
  if(y < height / 8 && x < width / 8) {
    setup();
  } 
  if (animationPhase < 2 && x > width / 2 - pushWidth / 2 && x < width / 2 + pushWidth / 2 && y > pushY && y < pushY + pushHeight) {
    showCup = true; 
    animationProgress = 0;
    animationPhase = 0;
    waitTime = 0;
    cupSplit = false;
  }
}


function mousePressed() {
  if(!isTouchDevice){
    if(animationPhase === 2){
      isTapping = true; // マウスを押したら振動を開始
      startSwipeY = mouseY; // 🔥 ここで開始位置を記録
    }
    handlePress(mouseX, mouseY);  
  }
}

function touchStarted(event) {
  if (!isTouchDevice) return; // PCでは処理しない

  // 画面上部または左上隅をタップしたときは、animationPhase に関係なくリセットする
  let tx = touches[0].x;
  let ty = touches[0].y;
  if (ty < height / 8 || (ty < height / 16 && tx < width / 16)) {
    handlePress(tx, ty);
  } else if (animationPhase === 2) {
    // それ以外の場合は、アニメーション中なら通常のタップ処理
    isTapping = true;
    startSwipeY = ty;
  } else if (animationPhase < 2) {
    handlePress(tx, ty);
  }

  if (event) event.preventDefault();
}


function mouseDragged() {
  if (isSwiping) {
      let swipeDistance = startSwipeY - mouseY;
      console.log('Mouse swipe distance:', swipeDistance);

      if (swipeDistance > swipeThreshold) {
          openCapsule(); // カプセルを開く
      } else {
          cupTopOffsetY = 0; // 通常の移動範囲
      }
  }
}

function touchMoved() {
  if (isSwiping && touches.length > 0) {
      let swipeDistance = startSwipeY - touches[0].y;
      console.log('Touch swipe distance:', swipeDistance);

      if (swipeDistance > swipeThreshold) {
          openCapsule(); // カプセルを開く
      } else {
          cupTopOffsetY = 0; // スワイプに応じて少しずつ移動
      }
  }
}

function mouseReleased() {
  if(!isTouchDevice){
    if(isTapping){
      isTapping = false; // マウスを離したら振動を止める
      isSwiping = false;  
      startSwipeY = null; // 🔥 スワイプの基準点をリセット
    }
  }
}

function touchEnded(event) {
  if(isTouchDevice){
    if(isTapping){
    isTapping = false;
    isSwiping = false;
    startSwipeY = null; // 🔥 スワイプの基準点をリセット
    }    
    if(event) event.preventDefault();
    return false;  // デフォルト動作を防ぐ 
  }
}

function openCapsule() {
  console.log("カプセル開封！");
  isSwiping = false;
  isTapping = false;
  capsuleOpened = true;      // カプセルが開いたことを記録
  cupTopOffsetY = -160;      // 上部を大きく上にずらして開いた状態を表現
}
