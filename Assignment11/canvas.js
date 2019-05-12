var canvas = document.getElementById("Game");
var context = canvas.getContext("2d");

var ballX = canvas.width / 2;
var ballY = canvas.height / 2;
var ballColor = 'rgb(0, 155, 155)';

var ballRadius = 50;

var speedX = 5;
var speedY = 3;
var moveRight = true;
var moveDown = true;

var clickCount = 0;

function animate() {
    context.fillStyle = 'rgba(255, 255, 255, 0.6)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    //draw the ball
    context.beginPath();
    context.fillStyle = ballColor;
    context.strokeStyle = 'black';
    context.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    context.fill();
    context.stroke();

    context.font = "30px Arial";
    context.fillStyle = 'black';
    context.fillText(`Click count: ${clickCount}`, 585, 40);

    if (ballX + ballRadius >= canvas.width || (ballX - ballRadius <= 0)) {
        moveRight = !moveRight;
    }

    if (ballY + ballRadius >= canvas.height || ballY - ballRadius <= 0) {
        moveDown = !moveDown;
    }

    if (moveRight) {
        ballX = ballX + speedX;
    } else {
        ballX = ballX - speedX;
    }

    if (moveDown) {
        ballY = ballY + speedY;
    } else {
        ballY = ballY - speedY;
    }

    window.requestAnimationFrame(animate);
}

animate();

function changeColor() {
    var redVal = Math.random() * 255;
    var greenVal = Math.random() * 255;
    var blueVal = Math.random() * 255;
    ballColor = `rgb(${redVal},${greenVal},${blueVal})`
}

function increaseSize() {
    ballRadius *= 1.2;
}

function decreaseSize() {
    ballRadius *= .8;
}

canvas.addEventListener('click', function (event) {
    // find the absolute value of the distance of the click from the ball
    // 
    var distX = Math.abs(ballX - event.clientX);
    var distY = Math.abs(ballY - event.clientY)

    if (distX < ballRadius && distY < ballRadius) {
        console.log('CLICK!!!!!');
        clickCount++;
    }
})