const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score')

let gameOver = false;
let foodX, foodY;
let snakeX = 10, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;

let highScore = localStorage.getItem('high-score') || 0;
highScoreElement.innerText = `Макс. очков: ${highScore}`;

const changeFoodPos = () => {
    foodX = Math.floor(Math.random() * 19) + 1;
    foodY = Math.floor(Math.random() * 19) + 1; 
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert('Вы проиграли! Нажмите "ОК", чтобы начать заново...');
    location.reload();
}



const swipeArea = document.getElementById('body');

let startX = 0;
let startY = 0;

swipeArea.addEventListener('touchstart', handleTouchStart);
swipeArea.addEventListener('touchmove', handleTouchMove);

function handleTouchStart(event) {
  const touch = event.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
}

function handleTouchMove(event) {
  if (!startX || !startY) return;

  const touch = event.touches[0];
  const deltaX = touch.clientX - startX;
  const deltaY = touch.clientY - startY;

  //проверка на направление свайпа
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0 && velocityY != -1) {
      velocityX = 0;
      velocityY = +1;
      // console.log('Свайп вправо');
    } else if (velocityY != +1) {
      velocityX = 0;
      velocityY = -1;
      // console.log('Свайп влево');
    }
  } else {
    if (deltaY > 0 && velocityX != -1) {
      velocityX = +1;
      velocityY = 0;
      // console.log('Свайп вниз');
    } else if (velocityX != +1) {
      velocityX = -1;
      velocityY = 0;
      // console.log('Свайп вверх');
    }
  }

  //сброс координат
  startX = 0;
  startY = 0;
}



const moveSnake = (event) => {
    if(event.keyCode === 37 && velocityY != 1 || event.keyCode === 65 && velocityY != 1) { // Left
        velocityX = 0;
        velocityY = -1;
    } else if(event.keyCode === 39 && velocityY != -1 || event.keyCode === 68 && velocityY != -1) { // Right
        velocityX = 0;
        velocityY = +1;
    } else if(event.keyCode === 38 && velocityX != 1 || event.keyCode === 87 && velocityX != 1) { // Up
        velocityX = -1;
        velocityY = 0;
    } else if(event.keyCode === 40 && velocityX != -1 || event.keyCode === 83 && velocityX != -1) { // Down
        velocityX = +1;
        velocityY = 0;
    }
    // console.log(event);
}

const initGame = () => {
    if(gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodX} / ${foodY}"></div>`;

    
    for (let i = snakeBody.length -1; i > 0; i--) {
        snakeBody[i] = snakeBody[i -1];
    }

    snakeBody[0] = [snakeX, snakeY]; 

    snakeX += velocityX;
    snakeY += velocityY;

    if(snakeX <= 0 || snakeX > 19 || snakeY <= 0 || snakeY > 19) {
        gameOver = true;
    }
    
    if(snakeX === foodX && snakeY === foodY) {
        changeFoodPos();
        snakeBody.push([snakeX, snakeY]);
        score++;

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem('high-score', highScore);
        scoreElement.innerText = `Очков: ${score}`;
        highScoreElement.innerText = `Макс. очков: ${highScore}`;
    }
    
    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += i == 0 ?
        `<div class="snakeHead" style="grid-area: ${snakeBody[i][0]} / ${snakeBody[i][1]}"></div>` :
        `<div class="snakeBody" style="grid-area: ${snakeBody[i][0]} / ${snakeBody[i][1]}"></div>`;
        
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true;
        }
    }
    
    gameBoard.innerHTML = htmlMarkup;
}

changeFoodPos();
setIntervalId = setInterval(initGame, 250);
document.addEventListener('keydown', moveSnake);
