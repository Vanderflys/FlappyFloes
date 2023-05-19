// Get the canvas element
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Bird properties
const bird = {
    x: 50,
    y: canvas.height / 2,
    radius: 20,
    gravity: 0.1,
    velocity: 0,
    jump: -3
};

// Pipe properties
const pipe = {
    x: canvas.width,
    width: 80,
    gap: 150,
    maxYPos: -150,
    speed: 2,
    pipes: [],
    spawnRate: 180, // Increase this value to slow down pipe spawning
    spawnCounter: 0
};

// Game state
let score = 0;
let gameSpeed = 2;
let isGameStarted = false; // Track if the game has started or not

// Event listeners
document.addEventListener('keydown', handleKeyDown);
canvas.addEventListener('click', handleCanvasClick);

function handleKeyDown(event) {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        if (!isGameStarted) {
            isGameStarted = true;
        }
        flapBird();
    }
}

function handleCanvasClick() {
    if (!isGameStarted) {
        isGameStarted = true;
        flapBird();
    }
}

// Flap the bird
function flapBird() {
    bird.velocity = 0; // Reset the velocity to zero
    bird.velocity += bird.jump; // Apply the jump value
}

// Game loop
function gameLoop() {
    // Update game state only if the game has started
    if (isGameStarted) {
        update();
    }

    // Render the game
    render();

    // Call the game loop recursively
    requestAnimationFrame(gameLoop);
}

// Generate new pipe
function generatePipe() {
    const yPos = Math.random() * (canvas.height - pipe.gap * 2) + pipe.gap;
    pipe.pipes.push({
        x: canvas.width,
        y: yPos
    });

    pipe.spawnCounter = 0; // Reset the spawn counter
}

// Update game state
function update() {
    // Bird velocity
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Check if bird is below the canvas
    if (bird.y + bird.radius > canvas.height) {
        isGameStarted = false;
        location.reload(); // Reload the page to restart the game
    }

    // Generate new pipe
    pipe.spawnCounter++; // Increment the spawn counter
    if (pipe.spawnCounter === pipe.spawnRate) {
        generatePipe();
    }

    // Move pipes
    for (let i = 0; i < pipe.pipes.length; i++) {
        const p = pipe.pipes[i];
        p.x -= pipe.speed;

        // Remove pipes outside the canvas
        if (p.x + pipe.width <= 0) {
            pipe.pipes.shift();
            score++;
        }

        // Collision detection
        if (
            bird.x + bird.radius > p.x &&
            bird.x - bird.radius < p.x + pipe.width &&
            (bird.y - bird.radius < p.y || bird.y + bird.radius > p.y + pipe.gap)
        ) {
            // Game over
            location.reload(); // Reload the page to restart the game
        }
    }

    // Game speed
    gameSpeed += 0.01;
}

// Render the game
function render() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (!isGameStarted) {
        // Render the click-to-start menu
        context.fillStyle = 'black';
        context.font = '30px Arial';
        context.fillText('Click to Start Playing Flappy Floes v1.11', canvas.width / 2 - 100, canvas.height / 2);
    } else {
        // Draw bird
        context.beginPath();
        context.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
        context.fillStyle = 'red';
        context.fill();
        context.closePath();

        // Draw pipes
        for (let i = 0; i < pipe.pipes.length; i++) {
            const p = pipe.pipes[i];

            // Upper pipe
            context.beginPath();
            context.rect(p.x, 0, pipe.width, p.y);
            context.fillStyle = 'green';
            context.fill();
            context.closePath();

            // Lower pipe
            context.beginPath();
            context.rect(p.x, p.y + pipe.gap, pipe.width, canvas.height - (p.y + pipe.gap));
            context.fillStyle = 'green';
            context.fill();
            context.closePath();
        }

        // Draw score
        context.fillStyle = 'black';
        context.font = '20px Arial';
        context.fillText('Score: ' + score, 10, 30);
    }
}

// Start the game loop
gameLoop();
