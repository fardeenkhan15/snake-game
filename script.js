const gameBoardSize = { width: 20, height: 20 };
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let score = 0;
let direction = { x: 0, y: 0 };
let speed = 5;

const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');
const gridSize = canvas.width / gameBoardSize.width;
const scoreBoard = document.getElementById('scoreBoard');

function gameLoop() {
  setTimeout(() => {
    update();
    draw();
    gameLoop();
  }, 1000 / speed); 
}

function update() {
  // Move snake
  const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  
  // Check for food consumption before moving the snake
  if (newHead.x === food.x && newHead.y === food.y) {
    eatFood();
  } else {
    // Remove the last segment of the snake if no food is eaten
    snake.pop();
  }

  // Add new head to the snake
  snake.unshift(newHead);

  // Check for collisions after moving the snake
  checkCollision();
}

function eatFood() {
  score += 1;
  scoreBoard.textContent = `Score: ${score}`;  // Update the score display
  placeFood();
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * gameBoardSize.width),
    y: Math.floor(Math.random() * gameBoardSize.height)
  };

  // Ensure food is not placed on the snake
  while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    food = {
      x: Math.floor(Math.random() * gameBoardSize.width),
      y: Math.floor(Math.random() * gameBoardSize.height)
    };
  }
}

function checkCollision() {
  const [head, ...body] = snake;

  // Check wall collisions
  if (head.x < 0 || head.x >= gameBoardSize.width || head.y < 0 || head.y >= gameBoardSize.height) {
    console.log('Wall collision detected');
    endGame();  
    return;
  }

  // Check self-collisions
  for (let segment of body) {
    if (segment.x === head.x && segment.y === head.y) {
      console.log('Self collision detected');
      endGame();
      return;
    }
  }
}

function endGame() {

  alert(`Game over! Your score was ${score}`);
  const playerName = prompt("Enter your name:");
  const newScore = { name: playerName, score: score };
  updateHighScores(newScore);
  score = 0;
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  scoreBoard.textContent = `Score: ${score}`;  // Reset the score display
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  ctx.fillStyle = 'green';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });
}

function changeDirection(event) {
  const keyPressed = event.keyCode;
  const goingUp = direction.y === -1;
  const goingDown = direction.y === 1;
  const goingRight = direction.x === 1;
  const goingLeft = direction.x === -1;

  if (keyPressed === 37 && !goingRight) {
    direction = { x: -1, y: 0 };
  } else if (keyPressed === 38 && !goingDown) {
    direction = { x: 0, y: -1 };
  } else if (keyPressed === 39 && !goingLeft) {
    direction = { x: 1, y: 0 };
  } else if (keyPressed === 40 && !goingUp) {
    direction = { x: 0, y: 1 };
  }
}

document.addEventListener('keydown', changeDirection);

gameLoop();

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

function updateHighScores(newScore) {
  highScores.push(newScore);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(5);
  localStorage.setItem('highScores', JSON.stringify(highScores));
  populateLeaderboard();
}

function populateLeaderboard() {
  const highScoresList = document.getElementById('highScoresList');
  highScoresList.innerHTML = highScores
    .map(score => `<li>${score.name} - ${score.score}</li>`)
    .join('');
}

document.addEventListener('DOMContentLoaded', populateLeaderboard);
