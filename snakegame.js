const snakeBoard = document.getElementById("game");
const ctx = snakeBoard.getContext("2d");

class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
//VARIABLES
let speed = 10;
let tileNumber = 20; //20x20 board
let tileSize = snakeBoard.width/tileNumber;
//initial position of the x
let headX = 10;
let headY = 10;
//array for snake body parts as it grows
const snakeParts = [];
//snake starts out with a head and a body part
let tailLength = 1; 
//first fruit position
let fruitX = 5;
let fruitY = 5;
//snake is still
let x_input = 0; //x_input allows for left/right movement
let y_input = 0; //y_input allows for up/down movement
//score starts at 0
let score = 0;
//rock obstacles
let rockX;
let rockY;
//mushroom obstacles
let mushroomX;
let mushroomY;

//FUNCTIONS

//GAME LOOP THAT KEEPS GAME GOING
function drawGame() 
{  
    snakePosition();
    let result = isGameOver();
    if (result==true) {
        return;
    }
    clearScreen();
    checkFruitEaten();
    drawFruit();
    if (score>4){
        drawRock();
        document.getElementById("rockAlert").innerHTML="Avoid the grey rocks!";
    }
    if (score>9){
        drawMushroom();
        document.getElementById("mushroomAlert").innerHTML="Don't eat the purple mushrooms! They're poisonous!";
    }
    drawSnake();
    drawScore();
    //make the game progressively faster
    if (score>10){
        speed=12;
    }
    if (score>20){
        speed=15;
    }
    setTimeout(drawGame, 1000/speed); //executes function after set time
}

//CHANGES POSITION OF THE SNAKE AS IT MOVES
function snakePosition() 
{
    headX = headX + x_input;
    headY = headY + y_input;
}

//CHECKS FOR GAME OVER
function isGameOver() {
    let gameOver = false;
    //not moving
    if (y_input === 0 && x_input === 0) {
        return false;
    }
    //bumps into the walls, **remember that board is 20x20 tiles
    else if (headX < 0||headY<0) {
      gameOver = true;
    } 
    else if (headX === tileNumber||headY===tileNumber) {
        gameOver = true;
    } 
    //snake bumps into a rock
    else if (headX===rockX&&headY===rockY){
        gameOver=true;
    }
    //snake eats mushroom
    else if (headX===mushroomX&&headY===mushroomY){
        gameOver=true;
    }
    //snake bumps into itself
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if (part.x === headX && part.y === headY) {
            gameOver = true;
            break;
        }
    }
    //displays game over
    if (gameOver) {
        ctx.fillStyle = "black";
        ctx.font = "50px Anton";
        ctx.fillText("GAME OVER!", snakeBoard.width/8, snakeBoard.height/2);
    }
    return gameOver;
}

//DRAWS THE SNAKEBOARD
function clearScreen() {
    ctx.fillStyle = "white";
    ctx.strokestyle="black";
    ctx.fillRect(0, 0, snakeBoard.width, snakeBoard.height);
    ctx.strokeRect(0,0, snakeBoard.width, snakeBoard.height);
}
function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "10px Verdana";
  ctx.fillText("Score " + score, 350, 390);
}

//CHECKS IF SNAKE ATE THE FRUIT
function checkFruitEaten() {
    if (fruitX === headX && fruitY == headY) {
        fruitX = Math.floor(Math.random() * tileNumber); //generates another fruit position in x-direction randomly
        fruitY = Math.floor(Math.random() * tileNumber); //generates another fruit position in y-direction randomly
        tailLength++;
        score++;
        rockPosition(); //generates random position of the rock everytime the score increases
        mushroomPosition(); //generates random position of the mushroom evertyime score increases
    }
}

//DRAWS FRUIT
function drawFruit() {
    ctx.fillStyle= "red";
    ctx.fillRect(fruitX*tileNumber, fruitY*tileNumber, tileSize, tileSize);
}

//DRAWS SNAKE
function drawSnake() 
{
  //snake body  
  ctx.fillStyle = "lightgreen";
  for (let i = 0; i < snakeParts.length; i++) {
      let part = snakeParts[i];
      ctx.fillRect(part.x * tileNumber, part.y * tileNumber, tileSize, tileSize);
  }
  snakeParts.push(new SnakePart(headX, headY)); //body part created next to the head
  while (snakeParts.length > tailLength) {
      snakeParts.shift(); //snakeParts can't be longer than the tail so body parts are removed
  }
  //snake head 
  ctx.fillStyle = "darkgreen";
  ctx.fillRect(headX * tileNumber, headY * tileNumber, tileSize, tileSize);
}

//DRAWS ROCK OBSTACLES
function drawRock(){
    ctx.fillStyle="grey";
    ctx.fillRect(rockX*tileNumber,rockY*tileNumber, tileSize, tileSize);
}

//GENERATES ROCK POSITION RANDOMLY
function rockPosition(){
    rockX = Math.floor(Math.random() * tileNumber);
    rockY = Math.floor(Math.random() * tileNumber); 
}

//DRAWS MUSHROOM OBSTACLES
function drawMushroom(){
    ctx.fillStyle="purple";
    ctx.fillRect(mushroomX*tileNumber,mushroomY*tileNumber, tileSize, tileSize);
}

//GENERATES MUSHROOM POSITION RANDOMLY
function mushroomPosition(){
    mushroomX = Math.floor(Math.random() * tileNumber);
    mushroomY = Math.floor(Math.random() * tileNumber); 
}

//MOVEMENT OF THE SNAKE
document.body.addEventListener("keydown", keyDown);
function keyDown(event) {
  //up key
  if (event.keyCode == 38) {
    if (y_input == 1) return; //prevents snake from moving down
    y_input = -1; //going up actually negative and vice versa
    x_input = 0;
  }
  //down key
  if (event.keyCode == 40) {
    if (y_input == -1) return; //prevents sanke from moving up
    y_input = 1;
    x_input = 0;
  }
  //left key
  if (event.keyCode == 37) {
    if (x_input == 1) return; //prevents snake from moving right
    y_input = 0;
    x_input = -1; //moving left is negative
  }
  //right key
  if (event.keyCode == 39) {
    if (x_input == -1) return; //prevents snake from moving left
    y_input = 0;
    x_input = 1; //moving right is positive
  }
}
drawGame();