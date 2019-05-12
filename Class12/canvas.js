var canvas = document.getElementById("Game");
var context = canvas.getContext("2d");

var ballX = canvas.width/2;
var ballY = canvas.height/2;
var ballColor = 'rgb(0, 155, 155)';

var ballRadius = 50;

var speedX = 5;
var speedY = 3;
var moveRight = true;
var moveDown = true;

function animate(){
    context.fillStyle = 'rgba(255, 255, 255, 0.6)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    //draw the ball
    context.beginPath();
    context.fillStyle = ballColor;
    context.strokeStyle = 'black';
    context.arc(ballX, ballY, ballRadius, 0, 2*Math.PI);
    context.fill();
    context.stroke();

    if(ballX + ballRadius >= canvas.width || (ballX - ballRadius <= 0) ){
        moveRight = !moveRight;
    }

    if(ballY + ballRadius >= canvas.height || ballY - ballRadius <= 0){
        moveDown = !moveDown;
    }

    if(moveRight){
        ballX = ballX + speedX;
    } else {
        ballX = ballX - speedX;
    }

    if(moveDown){
        ballY = ballY + speedY;
    } else {
        ballY = ballY - speedY;
    }

    window.requestAnimationFrame(animate);
}

animate();

canvas.addEventListener('click', function(event){ 
    // find the absolute value of the distance of the click from the ball
    // 
    var distX = Math.abs(ballX - event.clientX);
    var distY = Math.abs(ballY - event.clientY)

    if( distX < ballRadius && distY < ballRadius){
        console.log('CLICK!!!!!');
        ballColor = 'orange';
        ballRadius = 1200;
    }
})