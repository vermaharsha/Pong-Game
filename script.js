const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle properties
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const PADDLE_MARGIN = 20;
const PADDLE_SPEED = 5;

// Ball properties
const BALL_SIZE = 16;
const BALL_SPEED = 6;

// Left (player) paddle
const leftPaddle = {
    x: PADDLE_MARGIN,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

// Right (AI) paddle
const rightPaddle = {
    x: WIDTH - PADDLE_MARGIN - PADDLE_WIDTH,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

// Ball
const ball = {
    x: WIDTH / 2 - BALL_SIZE / 2,
    y: HEIGHT / 2 - BALL_SIZE / 2,
    size: BALL_SIZE,
    speedX: BALL_SPEED * (Math.random() < 0.5 ? 1 : -1),
    speedY: BALL_SPEED * (Math.random() * 2 - 1)
};

function resetBall() {
    ball.x = WIDTH / 2 - BALL_SIZE / 2;
    ball.y = HEIGHT / 2 - BALL_SIZE / 2;
    ball.speedX = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
    ball.speedY = BALL_SPEED * (Math.random() * 2 - 1);
}

// Draw paddles and ball
function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw net
    ctx.fillStyle = '#444';
    for (let i = 0; i < HEIGHT; i += 30) {
        ctx.fillRect(WIDTH/2 - 2, i, 4, 20);
    }

    // Draw left paddle
    ctx.fillStyle = '#fff';
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);

    // Draw right paddle
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x + ball.size/2, ball.y + ball.size/2, ball.size/2, 0, Math.PI * 2, false);
    ctx.fillStyle = '#fff';
    ctx.fill();
}

// Update game state
function update() {
    // Move ball
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Wall collision (top/bottom)
    if (ball.y <= 0) {
        ball.y = 0;
        ball.speedY *= -1;
    }
    if (ball.y + ball.size >= HEIGHT) {
        ball.y = HEIGHT - ball.size;
        ball.speedY *= -1;
    }

    // Paddle collision (left)
    if (
        ball.x <= leftPaddle.x + leftPaddle.width &&
        ball.y + ball.size >= leftPaddle.y &&
        ball.y <= leftPaddle.y + leftPaddle.height
    ) {
        ball.x = leftPaddle.x + leftPaddle.width;
        ball.speedX *= -1;
        // Add some "spin"
        let collidePoint = (ball.y + ball.size/2) - (leftPaddle.y + leftPaddle.height/2);
        collidePoint = collidePoint / (leftPaddle.height/2);
        let angle = collidePoint * Math.PI/4;
        ball.speedY = BALL_SPEED * Math.sin(angle);
    }

    // Paddle collision (right)
    if (
        ball.x + ball.size >= rightPaddle.x &&
        ball.y + ball.size >= rightPaddle.y &&
        ball.y <= rightPaddle.y + rightPaddle.height
    ) {
        ball.x = rightPaddle.x - ball.size;
        ball.speedX *= -1;
        // Add some "spin"
        let collidePoint = (ball.y + ball.size/2) - (rightPaddle.y + rightPaddle.height/2);
        collidePoint = collidePoint / (rightPaddle.height/2);
        let angle = collidePoint * Math.PI/4;
        ball.speedY = BALL_SPEED * Math.sin(angle);
    }

    // Point scored (left or right wall)
    if (ball.x < 0 || ball.x > WIDTH) {
        resetBall();
    }

    // AI paddle movement (simple follow)
    if (ball.y + ball.size/2 > rightPaddle.y + rightPaddle.height/2) {
        rightPaddle.y += PADDLE_SPEED;
    } else if (ball.y + ball.size/2 < rightPaddle.y + rightPaddle.height/2) {
        rightPaddle.y -= PADDLE_SPEED;
    }
    // Prevent AI from going out of bounds
    rightPaddle.y = Math.max(0, Math.min(HEIGHT - rightPaddle.height, rightPaddle.y));
}

// Mouse control for left paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    leftPaddle.y = mouseY - leftPaddle.height / 2;
    // Prevent paddle from going out of bounds
    if (leftPaddle.y < 0) leftPaddle.y = 0;
    if (leftPaddle.y + leftPaddle.height > HEIGHT) leftPaddle.y = HEIGHT - leftPaddle.height;
});

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();