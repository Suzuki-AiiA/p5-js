let isTouchDevice = false;
let gridState; // 各グリッドの状態を管理
let cols = 14;
let rows = 14;
let lastTouchedCell = { row: null, col: null }; // 直前に触れたセルを記録

function setup() {
  createCanvas(windowWidth, windowHeight); // 画面全体をキャンバスにする
  background(243, 0, 0); // 赤の背景
  isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // スクロールを無効にする
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';

  // スマホ用のサイズ調整
  document.documentElement.style.height = "100vh";
  document.body.style.height = "100vh";

  // グリッドの状態を初期化
  gridState = Array.from({ length: rows }, () => Array(cols).fill(false));
}

function draw() {
  background(243); // 背景を維持
  drawGrid(cols, rows); // 14×14のグリッドを描画
  fillGrid(); // 各グリッドにハンドを配置
}

function drawGrid(cols, rows) {
  let cellWidth = width / cols;
  let cellHeight = height / rows;
  stroke(0); // 黒い線で枠を描く
  strokeWeight(2);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (gridState[j][i]) {
        fill(0, 0, 255); // 押されているセルは青色
      } else {
        fill(243); // 通常時のセル色
      }
      rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
    }
  }

  for (let i = 0; i <= cols; i++) {
    line(i * cellWidth, 0, i * cellWidth, height);
  }
  for (let j = 0; j <= rows; j++) {
    line(0, j * cellHeight, width, j * cellHeight);
  }
}

// 全セルを初期状態に戻す（リセット処理）
function resetGrid() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      gridState[r][c] = false;
    }
  }
  // 最後に触れたセルも初期化
  lastTouchedCell = { row: null, col: null };
}

function fillGrid() {
  let cellWidth = width / 14;
  let cellHeight = height / 14;
  let fontSize = min(cellWidth, cellHeight) * 0.5; // セルサイズに合わせたフォントサイズ
  let ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

  // 共通の設定
  textSize(fontSize);
  stroke(255); // 文字の輪郭色（白）
  strokeWeight(2);
  fill(120); // 文字の内部色（グレー）
  textAlign(CENTER, CENTER);

  //
  // (0,0) のセル（ボタン＋AA）
  //
  // まずボタン（🔄）をセルの左上寄りに描画
  push();
  textAlign(LEFT, TOP);
  text('🔄', 0 + 5, 0 + 5); // 少し余白をあけて左上に
  pop();

  // そのセルの中央に "AA"
  // diagonal用に ranks[0] + ranks[0]
  text(ranks[0] + ranks[0], cellWidth / 2, cellHeight / 2);

  //
  // 1列目の2行目から縦方向に配置 (i=0～)
  //
  for (let i = 0; i < ranks.length; i++) {
    // (i+1) 行目へ配置（2行目〜）
    text(ranks[i], cellWidth / 2, (i + 1) * cellHeight + cellHeight / 2);
  }

  //
  // 1行目の2列目から横方向に配置 (i=0～)
  //
  for (let i = 0; i < ranks.length; i++) {
    // (i+1) 列目へ配置（2列目〜）
    text(ranks[i], (i + 1) * cellWidth + cellWidth / 2, cellHeight / 2);
  }

  //
  // グリッド全体のハンド表記
  //
  for (let i = 0; i < ranks.length; i++) {
    for (let j = 0; j < ranks.length; j++) {
      // ここで (0,0) を飛ばさない → AAも描画される
      let x = (j + 1) * cellWidth + cellWidth / 2;
      let y = (i + 1) * cellHeight + cellHeight / 2;

      // (0,0) は上で個別描画済み
      if (i === 0 && j === 0) {
        continue;
      }

      if (i === j) {
        // ポケットペア (AA, KK, QQ ...)
        text(ranks[i] + ranks[j], x, y);
      } else if (i < j) {
        // スートハンド
        text(ranks[i] + ranks[j] + "s", x, y);
      } else {
        // オフスートハンド
        text(ranks[j] + ranks[i] + "o", x, y);
      }
    }
  }
}

// マウス or タッチで押したとき
function mousePressed() {
  handleTouchOrClick(mouseX, mouseY);
}

// マウス or タッチでドラッグしたとき
function mouseDragged() {
  handleTouchOrClick(mouseX, mouseY);
}

// タップまたはドラッグの座標処理を統一
function handleTouchOrClick(x, y) {
  let cellWidth = width / cols;
  let cellHeight = height / rows;

  if (isTouchDevice && touches.length > 0) {
    x = touches[0].x;
    y = touches[0].y;
  }

  let col = Math.floor(x / cellWidth);
  let row = Math.floor(y / cellHeight);

  // リセットボタン (row=0, col=0) をタップ
  if (row === 0 && col === 0) {
    resetGrid();
    return;
  }

  // 直前に触れたセルと同じ場合は何もしない
  if (lastTouchedCell.row === row && lastTouchedCell.col === col) {
    return;
  }

  if (col >= 0 && col < cols && row >= 0 && row < rows) {
    gridState[row][col] = !gridState[row][col]; // トグル処理
    lastTouchedCell = { row, col }; // 触れたセルを記録
  }
}

// ウィンドウサイズが変更されたときにキャンバスを更新
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(243, 0, 0); // リサイズ時にも赤の背景を保持
}
