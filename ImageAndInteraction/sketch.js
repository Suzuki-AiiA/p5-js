let frontTexture;
let backTexture;
let capOpenSE;
let capCloseSE;

function setup() {
	createCanvas(400, 400 / 9 * 16); // 16:9の比率でキャンバスを作成
	imageMode(CENTER);
	frontTexture = loadImage('images/front.png');
	backTexture = loadImage('images/back.png');
	capOpenSE = loadSound('sounds/openCap.mp3');
	capCloseSE = loadSound('sounds/capClose.mp3');
}

var isPressed = false;

function draw() {
	background('skyblue');
	image(backTexture, 200, 400);
	if (isPressed) {
		image(frontTexture, 200, 300); // 開いた状態
	} else {
		image(frontTexture, 200, 400); // 閉じた状態
	}
}

function mousePressed() {
	if (!isPressed) {
		capOpenSE.play(); // キャップを開ける効果音
		isPressed = true;
	}
}

function mouseReleased() {
	if (isPressed) {
		capCloseSE.play(); // キャップを閉じる効果音
		isPressed = false;
	}
}