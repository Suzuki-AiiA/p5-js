let isTouchDevice = false; // タッチデバイスかどうかを保存
let bgImage; // 背景画像を格納する変数
let pushImage; // pushボタン画像を格納する変数
let cupImage; // cupblue画像を格納する変数
let cupTopImage; // cupblue 上半分の画像を格納する変数
let cupBottomImage; // cupblue 下半分の画像を格納する変数
let firemanImage; // fireman画像を格納する変数
let showCup = false; // cupblueを表示するかどうか
let cupY = 450; // cupblueの開始位置（下から上へ移動）
let cupSize = 40; // cupblueの開始サイズ
let animationProgress = 0; // アニメーションの進行度
let animationPhase = 0; // アニメーションフェーズの管理
let waitTime = 0; // アニメーションフェーズ間の待機時間
let cupSplit = false; // カプセルを分割するかどうかのフラグ
let startSwipeY = null; // スワイプ開始位置
let isSwiping = false; // スワイプ状態フラグ
let isTapping = false; // タップ状態フラグ
let openCapsuleUp = false; // カプセル開封フラグ
let swipeThreshold = 300; // スワイプ開封の閾値
let cupTopOffsetY = 0; // カプセル上部のY座標オフセット
let mobileoffset = 0; // モバイル端末のオフセット

let shakeOffsetX = 0; // シェイクのオフセットX
let shakeX = 0; // シェイクのX座標
let shearY = 0; // シェイクのY座標

// 表示位置とサイズを調整できるパラメータ（グローバル変数）
let pushWidth = 250; // 幅
let pushHeight = 60; // 高さ
let pushX; // setup() で初期化 // 中央基準で左端のX座標を求める // 中央基準で左端のX座標を求める
let pushY = 600; // Y座標

function preload() {
  bgImage = loadImage("images/gatyamachine3.png"); // 背景画像を読み込む
  pushImage = loadImage("images/push.png"); // pushボタン画像を読み込む
  cupImage = loadImage("images/cupblue.png"); // cupblue画像を読み込む
  cupTopImage = loadImage("images/cupblueup.png"); // cupblue 上半分の画像を読み込む
  cupBottomImage = loadImage("images/cupbluebot.png"); // cupblue 下半分の画像を読み込む
  firemanImage = loadImage("images/fireman.png"); // fireman画像を読み込む
}

function setup() {
  pushX = width / 2 - pushWidth / 2; // `width` が定義された後に計算
  createCanvas(400, (400 / 9) * 16); // 16:9の比率でキャンバスを作成
  imageMode(CENTER); // 画像の描画基準を中央に設定
  isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0; // タッチデバイスかどうかを判定

  showCup = false; // 初期状態をリセット
  animationProgress = 0; // アニメーションのリセット
  animationPhase = 0; // アニメーションフェーズのリセット
  waitTime = 0; // 待機時間のリセット
  cupSplit = false; // カプセルを分割しない状態
}

function draw() {
  image(bgImage, width / 2, height / 2, width, height); // 毎フレーム背景を描画
  image(pushImage, width / 2, pushY, pushWidth, pushHeight); // 毎フレーム pushボタンを描画

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
  
      image(cupBottomImage, cupX + shakeX, cupCenterY + shakeY, cupSize, cupSize);
      image(cupTopImage, cupX + shakeX, cupCenterY + shakeY + cupTopOffsetY, cupSize, cupSize);
    }else {
      image(cupImage, cupX, cupY, cupSize, cupSize);
    }
  }

}

function handlePress(x, y) {
  if (y < height / 8 && animationPhase < 2) { 
    setup();
  }
  if(y < height / 16 && x < width / 16) {
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

  if (animationPhase === 2) {
    isTapping = true;
    startSwipeY = touches.length > 0 ? touches[0].y : startSwipeY; // タッチ開始位置を記録
  }

  if (animationPhase < 2 && touches.length > 0) {
    handlePress(touches[0].x, touches[0].y); // カプセル未表示時のみ `handlePress()` を実行
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
      let touchY = touches[0].y;

      let swipeDistance = startSwipeY - touchY;
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
    cupTopOffsetY = -150; // カプセルの上部をさらに上に移動し、開いた状態にする
  
}