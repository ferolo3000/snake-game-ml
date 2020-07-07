// The video
let video;
let label = "waiting...";
let flipVideo;
let classifier;
let modelURL = 'https://teachablemachine.withgoogle.com/models/yYsFV6d3z/';


let canvas = document.getElementById("snake");
let context = canvas.getContext("2d");
let box = 24;
let snake = [];
snake[0] = {
    x: 8 * box,
    y: 8 * box
}
let direction = "right";
let food = {
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box
}

//------ML------------
function preload() {
    classifier = ml5.imageClassifier(modelURL + 'model.json');
}

function setup() {
    createCanvas(640, 420);
    video = createCapture(VIDEO);
    video.size(640, 420)
    video.hide();
    flipVideo = ml5.flipImage(video);
    classifyVideo();
}

function classifyVideo() {
    flipVideo = ml5.flipImage(video);
    classifier.classify(flipVideo, gotResults);
}

function gotResults(error, results) {
    if (error) {
        console.error(error);
        return;
    }
    label = results[0].label;
    classifyVideo();
}

function draw() {
    background(0);

    image(flipVideo, 0, 0);

    textSize(32);
    fill(255);
    text(label, width / 2, height - 16);

    if (label == "left") {
        direction = 'left'
    } else if (label == "right") {
        direction = 'right'
    } else if (label == "up") {
        direction = 'up'
    } else if (label == "down") {
        direction = 'down'
    }
}
//---------------END ML-----------------

function drawBG() {
    context.fillStyle = '#7AA252';
    context.fillRect(0, 0, 16 * box, 16 * box);
}

function drawSnake() {
    for (i = 0; i < snake.length; i++) {
        context.fillStyle = '#1E1E1E';
        context.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

function drawFood() {
    context.fillStyle = '#e7305b';
    context.fillRect(food.x, food.y, box, box);
}

function startGame() {

    if (snake[0].x > 15 * box && direction == "right") snake[0].x = 0;
    if (snake[0].x < 0 && direction == 'left') snake[0].x = 16 * box;
    if (snake[0].y > 15 * box && direction == "down") snake[0].y = 0;
    if (snake[0].y < 0 && direction == 'up') snake[0].y = 16 * box;

    for (i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            clearInterval(game);
        }
    }

    drawBG();
    drawSnake();
    drawFood();
    draw();

    //score
    document.getElementById("score").innerHTML = snake.length - 1;

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == "right") snakeX += box;
    if (direction == "left") snakeX -= box;
    if (direction == "up") snakeY -= box;
    if (direction == "down") snakeY += box;

    if (snakeX != food.x || snakeY != food.y) {
        snake.pop();
    } else {
        food.x = Math.floor(Math.random() * 15 + 1) * box;
        food.y = Math.floor(Math.random() * 15 + 1) * box;
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    snake.unshift(newHead);
}

function play() {
    let game = setInterval(startGame, 300);
}