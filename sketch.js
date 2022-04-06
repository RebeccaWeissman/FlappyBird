var flappy;
var score = 0;
var backdrop;
var upperTube, lowerTube;
var PLAY = 1,
  END = 0;
var gameState = PLAY;
function preload() {
  flappyImg = loadImage("flappy.gif");
  backdropImg = loadImage("backdrop.png");
  upperImg = loadImage("pipeDown.png");
  lowerImg = loadImage("bottom_tube.png");
  gameOverImg = loadImage("game over img.png");
  coinImg = loadImage("coin img.png");
  resetImg = loadImage("resetB.png");
  flyingSnd = loadSound ("flying.mp3");
  fallingSnd = loadSound ("fail.mp3");
}
function setup() {
  createCanvas(600, 400);
  backdrop = createSprite(400, 200, 200, 200);
  backdrop.addImage("backdrop", backdropImg);
  backdrop.scale = 1.5;
  gnd = createSprite(300,395,600,15  );
  gnd.shapeColor = rgb(128, 70, 27)
  gameOver = createSprite(300, 200, 20, 20);
  gameOver.addImage("gameEnd", gameOverImg);
  gameOver.scale = 0.2;
  reset = createSprite(300, 280, 20, 20);
  reset.addImage("reset", resetImg);
  reset.scale = 0.2;
  flappy = createSprite(100, 200, 10, 10);
  flappy.setCollider("circle", 0, 0, 50);
  flappy.addImage("flappyBird", flappyImg);
  flappy.scale = 0.5;
  flyingSnd.play();
  upperG = new Group();
  lowerG = new Group();
  coinG = new Group();
}

function draw() {
  background("skyblue");
  console.log(gameState);
  if (gameState == PLAY) {
    gameOver.visible = false;
    reset.visible = false;
    if (backdrop.x < 115) {
      backdrop.x = 400;
    }
    if (keyDown("space")) {
      flappy.velocityY = -4;
    }
    if (flappy.isTouching(coinG)) {
      score = score + 1;
      coinG.destroyEach();
    }
    flappy.velocityY = flappy.velocityY + 1;
    upper();
    lower();
    if (
      flappy.isTouching(upperG) ||
      flappy.isTouching(lowerG) ||
      flappy.y > 400
    ) {
      gameState = END;
      upperG.setVelocityXEach(0);
      upperG.setVelocityYEach(0);
      lowerG.setVelocityXEach(0);
      lowerG.setVelocityYEach(0);
    }
    backdrop.velocityX = -4;
  } else if (gameState == END) {
    gameIsOver();
  }
  drawSprites();
  fill("white");
  textSize(20);
  text("Score: " + score, 480, 20);
}

function upper() {
  if (World.frameCount % 100 == 0) {
    upperTube = createSprite(390, Math.round(random(-100, 50)), 10, 10);
    upperTube.setCollider(
      "rectangle",
      0,
      0,
      250,
      upperTube.height - upperTube.y + 1470
    );
    upperTube.addImage("topT", upperImg);
    upperTube.scale = 0.25;
    upperTube.lifetime = 100;
    upperTube.velocityX = -4;
    coin = createSprite(upperTube.x, upperTube.y + 240, 10, 10);
    coin.addImage("coinImg", coinImg);
    coin.scale = 0.05;
    coin.velocityX = -4;
    coin.lifetime = 100;
    gameOver.depth=coin.depth+5;
    coinG.add(coin);
    upperG.add(upperTube);
  }
}
function lower() {
  if (World.frameCount % 100 == 0) {
    lowerTube = createSprite(390, 360, 10, 10);
    lowerTube.addImage("bottomT", lowerImg);
    lowerTube.scale = 0.1;
    lowerTube.lifetime = 100;
    lowerTube.velocityX = -4;
    lowerTube.debug = true;
    lowerTube.setCollider("rectangle", 0, 0, 600, lowerTube.height);
    reset.depth=lowerTube.depth+5;
    lowerG.add(lowerTube);
  }
}
function gameIsOver() {
  if (gameState == END) {
    gameOver.visible = true;
    reset.visible = true;
    backdrop.velocityX = 0;
    flappy.velocityX = 0;
    flappy.velocityY = 0;
    flyingSnd.stop();
    coinG.setVelocityXEach(0);
    upperG.setLifetimeEach(-1);
    lowerG.setLifetimeEach(-1);
    coinG.setLifetimeEach(-1);
    if (mousePressedOver(reset)) {
      Reset();
    }
  }
}
function Reset() {
  gameState = PLAY;
  gameOver.visible = false;
  reset.visible = false;
  lowerG.destroyEach();
  upperG.destroyEach();
  coinG.destroyEach();
  score = 0;
  flappy.x = 100;
  flappy.y = 200;
  flyingSnd.play();
}
