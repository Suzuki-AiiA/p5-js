let suits = ["heart", "spade", "club", "diamond"];
let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
let deck = [], currentCards = [], opponentCards = [], cardPositions = [], opponentCardPositions = [];
let sliding = false;
let cardY = 400;
let opponentCardY = -140;
let cardDistance = 40;
let finalCardDistance = 80;
let slideQueue = [];
let slideY = -140;
let currentSlidingCard = null;
let slideIndex = 0;
let finalCards = [];
let gameReset = false;
let playerHandRank = "";
let opponentHandRank = "";
let heartImage, diamondImage, spadeImage, clubImage; // スート画像を保持する変数
let gameState = 0; // 0: Player1のスライドイン, 1: Player2のスライドイン, 2: Community Cardsのスライドイン
let customFont; // フォント変数

// パーティクルのリスト
let confettiParticles = [];
let winnerText = ""; // 勝利者テキストを保持する変数

// デバッグモード用の変数
let debugMode = true; // デバッグモードを有効にする場合はtrue
let debugPlayerCards = [
  { suit: "heart", value: "3" },
  { suit: "club", value: "10" }
];
let debugOpponentCards = [
  { suit: "diamond", value: "6" },
  { suit: "spade", value: "10" }
];
let debugCommunityCards = [
  { suit: "heart", value: "Q" },
  { suit: "spade", value: "J" },
  { suit: "spade", value: "5" },
  { suit: "diamond", value: "4" },
  { suit: "club", value: "8" }
];

function preload() {
  // スート画像を読み込む
  heartImage = loadImage("img/mark/heart.png");
  diamondImage = loadImage("img/mark/diamond.png");
  spadeImage = loadImage("img/mark/spade.png");
  clubImage = loadImage("img/mark/club.png");
  customFont = loadFont("font/Corporate-Logo-Rounded-Bold-ver3.otf"); // フォントのパスを指定
}

function setup() {
  createCanvas(900, 900 / 9 * 16); // 16:9の比率でキャンバスを作成
  textAlign(CENTER, CENTER);
  // タッチデバイスかどうかを判定
  isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // デッキを作成
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  
  initializeDeck();
  shuffleDeck();

  // デバッグモードならカードを設定
  if (debugMode) setDebugCards();

}

// デッキを初期化する関数
function initializeDeck() {
  deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
}


// パーティクルクラス
class ConfettiParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(3, 7);
    this.color = color(random(255), random(255), random(255)); // ランダムな色
    this.vx = random(-2, 2); // 横方向の速度
    this.vy = random(-3, -1); // 縦方向の速度（上に上がる）
    this.lifetime = 300; // 寿命（フレーム数）
  }

  // パーティクルを更新
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.lifetime -= 2; // 寿命を減らす
  }

  // パーティクルを描画
  draw() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }

  // パーティクルがまだ生きているか確認
  isAlive() {
    return this.lifetime > 0;
  }
}

// パーティクルを生成する関数
function spawnConfetti(x, y, count = 20) {
  for (let i = 0; i < count; i++) {
    confettiParticles.push(new ConfettiParticle(x, y));
  }
}

// パーティクルを描画・更新する関数
function updateConfetti() {
  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const particle = confettiParticles[i];
    particle.update();
    particle.draw();
    if (!particle.isAlive()) {
      confettiParticles.splice(i, 1); // 寿命が尽きたパーティクルを削除
    }
  }
}

function draw() {
  // 緑色の背景を設定
  background(50, 150, 50); // シンプルな緑のテーブル風背景

  // 描画関連の処理
  drawOpponentCards();
  drawPlayerCards();
  drawSlidingCards();
  drawFinalCards();
  drawPlayerLabels();
  updateConfetti(); // 紙吹雪を更新
  
  // 勝利者テキストを描画
  if (winnerText) {
    drawWinnerText();
  }
}

function drawPlayerCards() {
  for (let i = 0; i < currentCards.length; i++) {
    let x = cardPositions[i].x;
    drawCard(x, cardY, currentCards[i].suit, currentCards[i].value);
  }

  if (currentCards.length > 0) {
    textSize(16);
    fill(255);
    text(`${playerHandRank}`, width / 2 + 150, cardY + 20);
  }

  if (currentCards.length > 0 && cardY > height - 80) {
    cardY -= 5;
  } else {
    sliding = false;
  }
}

function drawOpponentCards() {
  for (let i = 0; i < opponentCards.length; i++) {
    let x = opponentCardPositions[i].x;
    drawCard(x, opponentCardY, opponentCards[i].suit, opponentCards[i].value);
  }

  if (opponentCards.length > 0) {
    textSize(16);
    fill(255);
    text(`${opponentHandRank}`, width / 2 + 150, opponentCardY + 20);
  }

  if (opponentCards.length > 0 && opponentCardY < 80) {
    opponentCardY += 5;
  } else {
    sliding = false;
  }
}


function drawSlidingCards() {
  if (currentSlidingCard) {
    slideY += 8;
    let targetX = width / 2 + (slideIndex - 2) * finalCardDistance;
    drawCard(targetX, slideY, currentSlidingCard.suit, currentSlidingCard.value);

    if (slideY >= height / 2) {
      slideY = -140;
      finalCards.push(currentSlidingCard);
      currentSlidingCard = null;
      slideIndex++;

      if (slideQueue.length > 0) {
        currentSlidingCard = slideQueue.shift();
      } else if (finalCards.length === 5) {
        // 役の判定をここで実行

        // console.log("Player Cards:", currentCards);
        // console.log("final Cards:", finalCards);
        // console.log("Opponent Cards:", opponentCards);

        const playerHand = evaluateHand([...currentCards, ...finalCards]);
        const opponentHand = evaluateHand([...opponentCards, ...finalCards]);

        playerHandRank = playerHand.name; // プレイヤーの役を格納
        opponentHandRank = opponentHand.name; // 対戦相手の役を格納

        const result = compareHands(playerHand, opponentHand);
        console.log(result); // ゲーム結果をコンソールに表示

        sliding = false; // スライドを解除
        gameState = 4; // リセット可能な状態に変更
        
        // 紙吹雪を発生
        triggerConfettiWinner(result);
      }
    }
  }
}


function drawWinnerText() {
  textSize(32);
  fill(255, 255, 0); // 黄色
  textAlign(CENTER, CENTER);

  if (winnerText === "Player 1 wins!" && cardPositions.length >= 2) {
    const x = (cardPositions[0].x + cardPositions[1].x) / 2;
    const y = cardY - 90; // Player 1のカードの少し上
    text(winnerText, x, y);
  } else if (winnerText === "Player 2 wins!" && opponentCardPositions.length >= 2) {
    const x = (opponentCardPositions[0].x + opponentCardPositions[1].x) / 2;
    const y = opponentCardY + 90; // Player 2のカードの少し下
    text(winnerText, x, y);
  }
  else {
    text(winnerText, width / 2, height / 2);
  }
}
// 勝者のテキストを設定する関数
function setWinnerText(result) {
  if (result === "Player 1 wins!" || result === "Player 2 wins!") {
    winnerText = result;
  } else {
    winnerText = "It's a draw!"; // ドローの場合のテキスト設定
  }
}


// 紙吹雪をトリガーする関数
function triggerConfettiWinner(result) {
  let x, y;
  if (result === "Player 1 wins!" && cardPositions.length >= 2) {
    x = (cardPositions[0].x + cardPositions[1].x) / 2;
    y = cardY + 50;
    spawnConfetti(x, y, 100); // 紙吹雪を生成
    setWinnerText(result);
  } else if (result === "Player 2 wins!" && opponentCardPositions.length >= 2) {
    x = (opponentCardPositions[0].x + opponentCardPositions[1].x) / 2;
    y = opponentCardY + 50;
    spawnConfetti(x, y, 100); // 紙吹雪を生成
    setWinnerText(result);
  } else if (result === "It's a draw!") {
    setWinnerText(result); // 勝者テキストを設定
  }
}


// ランクを数値化する関数
function getRank(handName) {
  const rankTable = {
    "ロイヤルフラッシュ": 10,
    "ストレートフラッシュ": 9,
    "フォーカード": 8,
    "フルハウス": 7,
    "フラッシュ": 6,
    "ストレート": 5,
    "スリーカード": 4,
    "ツーペア": 3,
    "ワンペア": 2,
    "ハイカード": 1,
  };
  return rankTable[handName] || 0; // デフォルトは0
}


// 役の比較を行う関数
function compareHands(player1, player2) { 
  console.log("Player 1:", player1);
  console.log("Player 2:", player2);
  if (player1.rank > player2.rank) return "Player 1 wins!";
  if (player1.rank < player2.rank) return "Player 2 wins!";

  if (player1.rank === 5 && player2.rank === 5) {
    // ハイカード（最大値）で比較
    const p1Max = Math.max(...player1.cards);
    const p2Max = Math.max(...player2.cards);
    if (p1Max > p2Max) return "Player 1 wins!";
    if (p1Max < p2Max) return "Player 2 wins!";
  }

  // 同じ役の場合、役に使用したカードで比較
  for (let i = 0; i < player1.cards.length; i++) {
    if (player1.cards[i] > player2.cards[i]) return "Player 1 wins!";
    if (player1.cards[i] < player2.cards[i]) return "Player 2 wins!";
  }

  // キッカーの比較（undefined チェックを含む）
  const player1Kickers = player1.kickers || [];
  const player2Kickers = player2.kickers || [];

  console.log("Player 1 Kickers:", player1Kickers);
  console.log("Player 2 Kickers:", player2Kickers);

  for (let i = 0; i < Math.max(player1Kickers.length, player2Kickers.length); i++) {
    const kicker1 = player1Kickers[i] || 0; // キッカーがない場合は 0
    const kicker2 = player2Kickers[i] || 0;
    if (kicker1 > kicker2) return "Player 1 wins!";
    if (kicker1 < kicker2) return "Player 2 wins!";
    
  }

  return "It's a draw!"; // 完全に同じ場合
}


function drawFinalCards() {
  for (let i = 0; i < finalCards.length; i++) {
    let x = width / 2 + (i - 2) * finalCardDistance;
    drawCard(x, height / 2, finalCards[i].suit, finalCards[i].value);
  }
}

function drawPlayerLabels() {
  textSize(16);
  fill(255);
  textAlign(CENTER, CENTER);

  // Player 1 Label
  if (currentCards.length > 0) {
    const player1X = (cardPositions[0].x + cardPositions[1].x) / 2 - 120; // カードの中央
    const player1Y = cardY - 30; // カードの少し下
    text("Player 1", player1X, player1Y);
  }

  // Player 2 Label
  if (opponentCards.length > 0) {
    const player2X = (opponentCardPositions[0].x + opponentCardPositions[1].x) / 2 - 120; // カードの左
    const player2Y = opponentCardY - 40; // カードの少し上
    text("Player 2", player2X, player2Y);
  }
}

function drawCard(x, y, suit, value) {
  const cardWidth = 65;
  const cardHeight = 110;

  // スートごとの背景色を設定
  let bgColor;
  let suitImage;

  if (suit === "heart") {
    bgColor = "red";
    suitImage = heartImage;
  } else if (suit === "diamond") {
    bgColor = "blue";
    suitImage = diamondImage;
  } else if (suit === "spade") {
    bgColor = "black";
    suitImage = spadeImage;
  } else if (suit === "club") {
    bgColor = "green";
    suitImage = clubImage;
  }

  // カードの背景を描画
  fill(bgColor);
  stroke(0);
  rect(x - cardWidth / 2, y - cardHeight / 2, cardWidth, cardHeight, 10);

  // 数字を描画
  fill(255); // 白色
  textSize(28);
  textAlign(CENTER, CENTER);
  textFont(customFont);
  text(value, x, y - 25);

  // スート画像を描画（サイズ調整可能）
  if (suitImage) {
    const suitSize = 35; // スート画像の表示サイズ
    image(suitImage, x - suitSize / 2, y + 5, suitSize, suitSize);
  }
}


function touchStarted() {
  console.log("GameState:", gameState); // デバッグ用ログ

  if (!sliding) {
    if (gameState === 0 && currentCards.length === 0) {
      // Player1のカードをスライドイン
      if (debugMode) {
        currentCards = [...debugPlayerCards];
        cardPositions = [
          { x: width / 2 - cardDistance },
          { x: width / 2 + cardDistance },
        ];
      } else {
        generatePlayerCards();
      }
      gameState++; // 状態を1に進める
    } else if (gameState === 1 && opponentCards.length === 0) {
      // Player2のカードをスライドイン
      if (debugMode) {
        opponentCards = [...debugOpponentCards];
        opponentCardPositions = [
          { x: width / 2 - cardDistance },
          { x: width / 2 + cardDistance },
        ];
      } else {
        generateOpponentCards();
      }
      gameState++; // 状態を2に進める
    } 
      // デバック用に条件を一部緩和。カードが用意されていなくてもこのループに入る。
      else if (gameState === 2 && finalCards.length < 5) {
      // Community Cardsをスライドイン
      if (debugMode) {
        console.log("Debug Community Cards");
        slideQueue = [...debugCommunityCards];
        currentSlidingCard = slideQueue.shift();
        sliding = true;
        slideY = -140;
      } else {
        generateSlidingCards();
      }
      gameState++; // 状態を3に進める
    } else if (gameState === 4) {
      // ゲームをリセット
      resetGame();
      gameState = 0; // 状態を初期状態に戻す
    }
  }
}




function generateOpponentCards() {
  opponentCards = [deck.pop(), deck.pop()];
  opponentCardPositions = [
    { x: width / 2 - cardDistance },
    { x: width / 2 + cardDistance }
  ];
  opponentCardY = -140; // スライド開始位置
  sliding = true; // スライド中フラグを設定
}

function generatePlayerCards() {
  currentCards = [deck.pop(), deck.pop()];
  cardPositions = [
    { x: width / 2 - cardDistance },
    { x: width / 2 + cardDistance }
  ];
  cardY = height;
  sliding = true;
}

function generateSlidingCards() {
  if (debugMode) {
    // デバッグモードの場合、事前設定されたカードを使用
    slideQueue = [...debugCommunityCards];
  } else {
    // 本番環境ではデッキからカードを取得
    slideQueue = [deck.pop(), deck.pop(), deck.pop(), deck.pop(), deck.pop()];
  }
  currentSlidingCard = slideQueue.shift();
  slideY = -140;
  slideIndex = 0;
}

// ゲームをリセットする関数
function resetGame() {
  currentCards = [];
  opponentCards = [];
  cardPositions = [];
  opponentCardPositions = [];
  sliding = false;
  slideQueue = [];
  slideY = -140;
  currentSlidingCard = null;
  slideIndex = 0;
  finalCards = [];
  gameReset = false;
  playerHandRank = "";
  opponentHandRank = "";
  winnerText = ""; // 勝者テキストをリセット
  deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  shuffleDeck();

  // デバッグモードならカードを設定
  if (debugMode) setDebugCards();
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

/*ChatGPTのコード
function evaluateHand(cards) {
  // 修正後のランク変換ロジック
  let ranks = cards.map(card => {
    const rawValue = card.value;
    // Aを14、J/Q/Kを11/12/13、数字はそのまま数値化
    if (rawValue === "A") return 14;
    if (rawValue === "J") return 11;
    if (rawValue === "Q") return 12;
    if (rawValue === "K") return 13;
    return parseInt(rawValue); // 2-10は数値に変換
  }).sort((a, b) => b - a); // 降順でソート
  console.log("ranks", ranks);
  let suits = cards.map(card => card.suit);

  // フラッシュの判定
  let suitCounts = {};
  for (let suit of suits) {
    suitCounts[suit] = (suitCounts[suit] || 0) + 1;
  }
  let flushSuit = Object.keys(suitCounts).find(suit => suitCounts[suit] >= 5);
  let isFlush = !!flushSuit;

  let flushRanks = isFlush ? cards.filter(card => card.suit === flushSuit).map(card => values.indexOf(card.value) + 1).sort((a, b) => b - a) : [];

  // ストレートの判定（A=1, K=13対応 + A, 2, 3, 4, 5 の特例処理）
  let uniqueRanks = [...new Set(ranks)];
  if (uniqueRanks.includes(14)) uniqueRanks.push(1);
  let isStraight = uniqueRanks.some((_, i) =>
    i <= uniqueRanks.length - 5 &&
    uniqueRanks[i] - uniqueRanks[i + 4] === 4
  );

  let isStraightFlush = isFlush && flushRanks.length >= 5 && flushRanks.some((_, i) =>
    i <= flushRanks.length - 5 &&
    flushRanks[i] - flushRanks[i + 4] === 4
  );

  let rankCounts = ranks.reduce((acc, rank) => {
    acc[rank] = (acc[rank] || 0) + 1;
    return acc;
  }, {});

  let counts = Object.values(rankCounts).sort((a, b) => b - a);

  // 役で使われたカードを特定
  let usedCards = [];

  // 各役の判定
  if (isStraightFlush && flushRanks[0] === 14) {
    usedCards = flushRanks.slice(0, 5);
    return { rank: 10, name: "ロイヤルフラッシュ", cards: usedCards, kickers: [] };
  }
  if (isStraightFlush) {
    usedCards = flushRanks.slice(0, 5);
    return { rank: 9, name: "ストレートフラッシュ", cards: usedCards, kickers: [] };
  }
  if (counts[0] === 4) {
    let fourCardRank = parseInt(Object.keys(rankCounts).find(key => rankCounts[key] === 4));
    usedCards = ranks.filter(rank => rank === fourCardRank).slice(0, 4);
    return { rank: 8, name: "フォーカード", cards: usedCards, kickers: ranks.filter(rank => rank !== fourCardRank).slice(0, 1) };
  }
  if (counts[0] === 3 && counts[1] === 2) {
    let threeCardRank = parseInt(Object.keys(rankCounts).find(key => rankCounts[key] === 3));
    let pairRank = parseInt(Object.keys(rankCounts).find(key => rankCounts[key] === 2));
    usedCards = ranks.filter(rank => rank === threeCardRank || rank === pairRank).slice(0, 5);
    return { rank: 7, name: "フルハウス", cards: usedCards, kickers: [] };
  }
  if (isFlush) {
    usedCards = flushRanks.slice(0, 5);
    return { rank: 6, name: "フラッシュ", cards: usedCards, kickers: [] };
  }
  if (isStraight) {
    usedCards = uniqueRanks.slice(0, 5);
    return { rank: 5, name: "ストレート", cards: usedCards, kickers: [] };
  }
  if (counts[0] === 3) {
    let threeCardRank = parseInt(Object.keys(rankCounts).find(key => rankCounts[key] === 3));
    usedCards = ranks.filter(rank => rank === threeCardRank).slice(0, 3);
    return { rank: 4, name: "スリーカード", cards: usedCards, kickers: ranks.filter(rank => rank !== threeCardRank).slice(0, 2) };
  }
  if (counts[0] === 2 && counts[1] === 2) {
    let pairRanks = Object.keys(rankCounts).filter(key => rankCounts[key] === 2).map(Number).sort((a, b) => b - a);
    usedCards = ranks.filter(rank => pairRanks.includes(rank)).slice(0, 4);
    return { rank: 3, name: "ツーペア", cards: usedCards, kickers: ranks.filter(rank => !pairRanks.includes(rank)).slice(0, 1) };
  }
  if (counts[0] === 2) {
    let pairRank = parseInt(Object.keys(rankCounts).find(key => rankCounts[key] === 2));
    usedCards = ranks.filter(rank => rank === pairRank).slice(0, 2);
    // キッカーを降順でソートしてから選択
    const kickers = ranks
      .filter(rank => rank !== pairRank) // ペア以外を抽出
      .sort((a, b) => b - a) // 降順でソート
      .slice(0, 3); // 上位3枚を選択

    return { 
      rank: 2, 
      name: "ワンペア", 
      cards: usedCards, 
      kickers: kickers 
    };
  }

  usedCards = ranks.slice(0, 5);
  return { rank: 1, name: "ハイカード", cards: usedCards, kickers: ranks.filter(rank => !usedCards.includes(rank)).slice(0, 5) };
}
*/

/*DeepSeekのコード*/
function evaluateHand(cards) {
  // カードのランクを数値に変換（A=14, J=11, Q=12, K=13）
  let ranks = cards.map(card => {
    const value = card.value;
    if (value === "A") return 14;
    if (value === "J") return 11;
    if (value === "Q") return 12;
    if (value === "K") return 13;
    return parseInt(value);
  }).sort((a, b) => b - a); // 降順ソート

  // スートの種類をカウント（フラッシュ判定用）
  let suits = cards.map(card => card.suit);
  let suitCounts = suits.reduce((acc, suit) => {
    acc[suit] = (acc[suit] || 0) + 1;
    return acc;
  }, {});
  let flushSuit = Object.keys(suitCounts).find(suit => suitCounts[suit] >= 5);
  let isFlush = !!flushSuit;

  // フラッシュ用ランク（フラッシュスートのカードのみ抽出）
  let flushRanks = isFlush ? 
    cards.filter(c => c.suit === flushSuit)
        .map(c => {
          const v = c.value;
          if (v === "A") return 14;
          if (v === "J") return 11;
          if (v === "Q") return 12;
          if (v === "K") return 13;
          return parseInt(v);
        }).sort((a, b) => b - a) : [];

  // ストレート判定用（Aを1として追加）
  let straightRanks = [...new Set(ranks)]; // 重複排除
  if (straightRanks.includes(14)) {
    straightRanks.push(1); // A-2-3-4-5用に1を追加
    straightRanks.sort((a, b) => b - a);
  }

  // 正確なストレート判定ロジック
  let straightCards = [];
  for (let i = 0; i <= straightRanks.length - 5; i++) {
    if (straightRanks[i] - straightRanks[i + 4] === 4) {
      straightCards = straightRanks.slice(i, i + 5);
      break;
    }
  }
  let isStraight = straightCards.length === 5;

  // ストレートフラッシュ判定
  let isStraightFlush = false;
  if (isFlush && flushRanks.length >= 5) {
    let straightFlushRanks = [...new Set(flushRanks)];
    if (straightFlushRanks.includes(14)) {
      straightFlushRanks.push(1);
      straightFlushRanks.sort((a, b) => b - a);
    }
    for (let i = 0; i <= straightFlushRanks.length - 5; i++) {
      if (straightFlushRanks[i] - straightFlushRanks[i + 4] === 4) {
        isStraightFlush = true;
        straightCards = straightFlushRanks.slice(i, i + 5);
        break;
      }
    }
  }

  // ランクの出現回数をカウント
  let rankCounts = ranks.reduce((acc, rank) => {
    acc[rank] = (acc[rank] || 0) + 1;
    return acc;
  }, {});

  let counts = Object.values(rankCounts).sort((a, b) => b - a);

  // 役の判定（優先順位順）
  if (isStraightFlush) {
    console.log("isRoyale", straightCards);
    if (straightCards[0] === 14 && [13, 12, 11, 10].every(val => straightCards.includes(val))) {
      console.log("RoyalFlush", straightCards);
      return { rank: 10, name: "ロイヤルフラッシュ", cards: straightCards, kickers: [] };
    }
    return { rank: 9, name: "ストレートフラッシュ", cards: straightCards, kickers: [] };
  }
  if (counts[0] === 4) {
    const fourRank = parseInt(Object.keys(rankCounts).find(k => rankCounts[k] === 4));
    const kickers = ranks.filter(r => r !== fourRank).sort((a, b) => b - a).slice(0, 1);
    return { rank: 8, name: "フォーカード", cards: Array(4).fill(fourRank), kickers };
  }
  if (counts[0] === 3 && counts[1] === 2) {
    const threeRank = parseInt(Object.keys(rankCounts).find(k => rankCounts[k] === 3));
    const pairRank = parseInt(Object.keys(rankCounts).find(k => rankCounts[k] === 2));
    return { rank: 7, name: "フルハウス", cards: [threeRank, threeRank, threeRank, pairRank, pairRank], kickers: [] };
  }
  if (isFlush) {
    return { rank: 6, name: "フラッシュ", cards: flushRanks.slice(0, 5), kickers: [] };
  }
  if (isStraight) {
    return { rank: 5, name: "ストレート", cards: straightCards, kickers: [] };
  }
  if (counts[0] === 3) {
    const threeRank = parseInt(Object.keys(rankCounts).find(k => rankCounts[k] === 3));
    const kickers = ranks.filter(r => r !== threeRank).sort((a, b) => b - a).slice(0, 2);
    return { rank: 4, name: "スリーカード", cards: Array(3).fill(threeRank), kickers };
  }
  if (counts[0] === 2 && counts[1] === 2) {
    const pairs = Object.keys(rankCounts)
      .filter(k => rankCounts[k] === 2) // ペアを取得
      .map(Number) // 数値変換
      .sort((a, b) => b - a); // 降順ソート（強いペアを優先）

    const topTwoPairs = pairs.slice(0, 2); // 最も強い2つのペア

    // キッカーの選択（ペア以外で最も強い1枚）
    const kickers = ranks
      .filter(r => !topTwoPairs.includes(r)) // ペアに含まれないカードを取得
      .sort((a, b) => b - a) // 降順ソート
      .slice(0, 1); // 上位1枚を取得（キッカー）

    return { rank: 3, name: "ツーペア", cards: [...topTwoPairs.flatMap(p => [p, p]), ...kickers], kickers };
}
  if (counts[0] === 2) {
    const pairRank = parseInt(Object.keys(rankCounts).find(k => rankCounts[k] === 2));
    const kickers = ranks.filter(r => r !== pairRank).sort((a, b) => b - a).slice(0, 3);
    return { rank: 2, name: "ワンペア", cards: [pairRank, pairRank], kickers };
  }

  // ハイカード
  return { rank: 1, name: "ハイカード", cards: ranks.slice(0, 5), kickers: [] };
}

function setDebugCards() {
  if (debugMode) {
    // デバッグ用カードをスライドイン用キューに設定
    currentCards = [];
    opponentCards = [];
    finalCards = [];
    slideQueue = [...debugCommunityCards];
    slideIndex = 0;
    sliding = false;

    // スライドイン座標の初期化
    cardY = height;
    opponentCardY = -140;

    // 初期状態でクリック待ち
    gameState = 0;

    // カードの配置座標をリセット
    cardPositions = [];
    opponentCardPositions = [];
  }
}

