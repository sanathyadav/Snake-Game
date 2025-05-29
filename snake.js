// Get the canvas element and its drawing context
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Set the size of each grid cell and calculate the number of cells per row/column
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Initialize the snake as an array of segments (each with x, y coordinates)
let snake = [{ x: 10, y: 10 }];
// Direction the snake is moving (x, y). Starts stationary.
let direction = { x: 0, y: 0 };
// Food position (x, y)
let food = { x: 5, y: 5 };
// Game state and score
let gameOver = false;
let score = 0;
let speed = 200; // Slow speed at the beginning

// Overlay and restart button
const overlay = document.getElementById('overlay');
const finalScore = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

// Draw everything on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = '#0f0';
    snake.forEach((part, idx) => {
        ctx.fillStyle = idx === 0 ? '#39FF14' : '#0f0'; // Head is lighter green
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // Draw food
    ctx.fillStyle = 'blue';
    ctx.shadowColor = '#00f';
    ctx.shadowBlur = 10;
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    ctx.shadowBlur = 0;

    // Update the scoreboard outside the canvas
    document.getElementById('scoreboard').textContent = 'Score: ' + score;
}

// Move the snake in the current direction and handle collisions
function moveSnake() {
    if (direction.x === 0 && direction.y === 0) return;

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check collision with walls
    if (
        head.x < 0 || head.x >= tileCount ||
        head.y < 0 || head.y >= tileCount
    ) {
        gameOver = true;
        return;
    }

    // Check collision with itself
    if (snake.some(part => part.x === head.x && part.y === head.y)) {
        gameOver = true;
        return;
    }

    snake.unshift(head);

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
        // Optional: speed up a bit as score increases
        if (speed > 60) speed -= 5;
    } else {
        snake.pop();
    }
}

// Place food at a random position not occupied by the snake
function placeFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (snake.some(part => part.x === newFood.x && part.y === newFood.y));
    food = newFood;
}

// Listen for arrow key presses to change the snake's direction
document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 1) break;
            direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === -1) break;
            direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 1) break;
            direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === -1) break;
            direction = { x: 1, y: 0 };
            break;
    }
});

// Main game loop: moves the snake, draws everything, and checks for game over
function gameLoop() {
    if (gameOver) {
        showGameOver();
        return;
    }
    moveSnake();
    draw();
    setTimeout(gameLoop, speed);
}

// Show the overlay with Game Over and Restart button
function showGameOver() {
    overlay.style.display = 'flex';
    finalScore.textContent = 'Final Score: ' + score;
}

// Restart the game
function restartGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    food = { x: 5, y: 5 };
    gameOver = false;
    score = 0;
    speed = 200;
    overlay.style.display = 'none';
    draw();
    gameLoop();
}

restartBtn.addEventListener('click', restartGame);

// Initial draw and start the game loop
draw();
gameLoop();