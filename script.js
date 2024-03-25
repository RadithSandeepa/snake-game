//Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
const gameStart = document.getElementById('gameStart');
const gameOver = document.getElementById('gameOver');
const gameBonus = document.getElementById('gameBonus');

//Define game variables
const gridSize = 20;
let snake = [{x: 10, y: 10}];
let food = generateFood();
let highScore  = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;


//Draw game map, snake and food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

//Draw snake
function drawSnake() {
    snake.forEach(segment => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

//Create a snake or fool cube/div
function createGameElement(tag, className){
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

//Set the position of snake or food
function setPosition(element, position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// //Test the draw function
//draw();

//Draw food function
function drawFood(){
    if(gameStarted){
        ///////remove this if there is an error
        let foodPosition;
        foodPosition = generateFood();
        while (isFoodOnSnake(foodPosition)) {
            foodPosition = generateFood();
        } 
        ///////
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

//Check if food is on snake's body
function isFoodOnSnake(foodPosition){
    return snake.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y);
}
////////

//Generate food
function generateFood(){
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x,y};
}

//Moving the snake
function move(){
    const head = {...snake[0]}; 
    switch(direction){
        case 'up':
            head.y--;
            break;
        case 'right':
            head.x++;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
    }
    snake.unshift(head);
    
    //snake.pop();
    if(head.x === food.x && head.y === food.y){
        gameBonus.play()
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); //Clear past interval
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    }else{
        snake.pop();
    }
}

//Test moving
// setInterval(() => {
//     move(); //Move first
//     draw(); //Drawing the new position
// }, 200)

//Start game function
function startGame(){
    gameStart.play()
    gameStarted = true; //keep track of the running game
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

//Keypress event listener
function handleKeyPress(event){
    if((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === 'Space')){
        startGame();
       
    }else if(event.key === 'Escape') {
        togglePause();
    }else{
        switch(event.key){
            case 'ArrowUp':
                if(direction !== 'down') direction = 'up';
                break;
            case 'ArrowRight':
                if(direction !== 'left') direction = 'right';
                break;
            case 'ArrowDown':
                if(direction !== 'up') direction = 'down';
                break;
            case 'ArrowLeft':
                if(direction !== 'right') direction = 'left';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

function togglePause() {
    if (gameStarted) {
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = null;
        } else {
            gameInterval = setInterval(() => {
                move();
                checkCollision();
                draw();
            }, gameSpeedDelay);
        }
    }
}

function increaseSpeed(){
    if(gameSpeedDelay > 150){  
        gameSpeedDelay -= 5;
    }else if(gameSpeedDelay > 100){
        gameSpeedDelay -= 3;
    }
    else if(gameSpeedDelay > 50){
        gameSpeedDelay -= 2;
    }
    else if(gameSpeedDelay > 25){
        gameSpeedDelay -= 1;
    }
}

function checkCollision(){
    const head = snake[0];
    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        gameOver.play()
        resetGame();
    }

    for(let i = 1; i < snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            gameOver.play()
            resetGame();
        }
    }
}

function resetGame(){
    updateHighScore();
    stopGame();

    snake = [{x: 10, y: 10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore()
}

function updateScore(){
    const currentScore = snake.length - 1
    score.textContent = currentScore.toString().padStart(3, '0');  //make a triple digit score
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore(){
    const currentScore = snake.length - 1;
    if(currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
      
    }
    highScoreText.style.display = 'block';
}   