let isTouchDevice = false; // タッチデバイスかどうかを保存

function setup() {
  createCanvas(800, 800); // キャンバスを作成
  background(240); // 背景色を設定

  // タッチデバイスかどうかを判定
  isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// 円を描画する関数（マウスでもタッチでも共通）
function drawCircle(x, y) {
  let r = random(10, 50); // ランダムな半径を設定
  let color = [random(255), random(255), random(255)]; // ランダムな色
  fill(color);
  noStroke();
  ellipse(x, y, r, r); // 指定位置に円を描画
}

// マウスクリック時に円を描画
function mousePressed() {
  if (isTouchDevice) return;
  drawCircle(mouseX, mouseY); // マウスの位置で円を描画
}

// マウスドラッグ時に円を描画
function mouseDragged() {
  if (isTouchDevice) return;
  drawCircle(mouseX, mouseY); // マウスの位置で円を描画
}

// タッチ開始時に円を描画
function touchStarted() {
  for (let touch of touches) {
    drawCircle(touch.x, touch.y); // タッチの位置で円を描画
  }
}

// タッチ中に円を描画
function touchMoved() {
  for (let touch of touches) {
    drawCircle(touch.x, touch.y); // タッチの位置で円を描画
  }
}

function draw(){
}
