let pokeBallModel;
let pokeBallTexture;

function setup() {
  pokeBallModel = loadModel('assets/pokeBall.obj', true);
  pokeBallTexture = loadImage('assets/pokeBall.png');
  createCanvas(400, 400/9*16, WEBGL);
}

function draw(){
  background(240);
  //normalMaterial();
  orbitControl();
  //texture(pokeBallTexture);
  rotateY(frameCount * 0.01);
  model(pokeBallModel);
}