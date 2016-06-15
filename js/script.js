var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// rectangle
// ctx.beginPath();
// ctx.rect(20, 40, 50, 50);
// ctx.fillStyle = "#FF0000";
// ctx.fill();
// ctx.closePath();
//
// //circle
// ctx.beginPath();
// ctx.arc(240, 160, 20, 0, Math.PI * 2, false);
// ctx.fillStyle = "green";
// ctx.fill();
// ctx.closePath();

//beginPath() and closePath() methods are used to open and close a drawing on the canvas
// fillStyle can use hex values, RGB, and color keywords


//Defining the ball starting points
var x = canvas.width / 2;
var y = canvas.height - 30;
//Defining the ball movement direction and pace
var dx = 2;
var dy = -2;
var ballRadius = 10;
// Paddle
var paddleH = 10;
var paddleW = 75;
var paddleX = (canvas.width-paddleW)/2;
// Keyboard controls = false until event.listener makes it true
var rightPressed = false;
var leftPressed = false;

//Define Bricks
var bricks = [];
var brickRowCount = 5;
var brickColumnCount = 10;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
//offset is so bricks aren't drawn right next to teh Wall
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;

var bricks = [];
for(c = 0; c < brickColumnCount; c++) {
   bricks[c] = [];
   for(r = 0; r < brickRowCount; r++) {
     bricks[c][r] = { x: 0, y: 0, status: 1 };
   }
}

//event listener to change keyboard press values
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Intentionally did not add mouse events because I did not enjoy using the ouse


//keyCode 37 = left cursor key, keyCode 39 = right cursor key
function keyDownHandler(e) {
   if(e.keyCode == 39) {
      rightPressed = true;
   }
   else if(e.keyCode == 37) {
      leftPressed = true;
   }
}

function keyUpHandler(e) {
   if(e.keyCode == 39) {
      rightPressed = false;
   }
   else if(e.keyCode == 37) {
      leftPressed = false;
   }
}

// Drawing the ball
function drawBall() {
   ctx.beginPath();
   ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
   ctx.fillStyle = "blue";
   ctx.fill();
   ctx.closePath();
}

//Draw the paddle
function drawPaddle() {
   ctx.beginPath();
   ctx.rect(paddleX, canvas.height - paddleH, paddleW, paddleH);
   ctx.fillStyle = "#0095DD"
   ctx.fill();
   ctx.closePath;
}

function drawBricks() {
   for(c = 0; c < brickColumnCount; c++) {
      for(r = 0; r < brickRowCount; r++) {
         if (bricks[c][r].status == 1) {
         //space out the bricks so they're not all on top of eachother
            var brickX = (c * (brickWidth+brickPadding)) + brickOffsetLeft;
            var brickY = (r * (brickHeight+brickPadding)) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.closePath();
         }
      }
   }
}

// brick collison detection
function collisionDetection() {
   for (c = 0; c < brickColumnCount; c++) {
      for (r = 0; r <brickRowCount; r++) {
         var b = bricks[c][r];
         if (b.status == 1) {
            if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
               dy = -dy;
               b.status = 0;
               score++;
               if(score == brickRowCount*brickColumnCount) {
                  alert("You Win!!!");
                  document.location.reload();
               }
            }
         }
      }
   }
}

// draw the score
function drawScore() {
   ctx.font = "16px Arial";
   ctx.fillStyle = "#0095DD";
   ctx.fillText("Score: "+score, 8, 20);
}

// draw lives
function drawLives() {
   ctx.font = "16px Arial";
   ctx.fillStyle = "#0095DD";
   ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

// drawing code
function draw() {
//using x,y coordinates to clear everything in the canvas
   ctx.clearRect(0, 0, canvas.width, canvas.height);
      // why does calling the ball here do exactly?
   drawBricks();
   drawBall();
   drawPaddle();
   drawScore();
   drawLives();
   collisionDetection();

      //Assign the ball to detect it's movement variables
   //Set Right and Left Wall detection
   if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
      dx = -dx;
   }
   //Set Top and Bot Wall detection
   if(y + dy < ballRadius) {
      dy = -dy;
   }
   else if(y + dy > canvas.height-ballRadius) {
      if(x > paddleX && x < paddleX + paddleW){
         dy = -dy
      }
      else {
         // life counter decrement condition
         if(!lives) {
            alert("Game Over!")
            document.location.reload();
         }
         else {
            x = canvas.width/2;
            y = canvas.height - 30;
            dx = 2;
            dy = -2;
            paddleX = (canvas.width - paddleW) / 2;
         }
      }
   }

   // check to see if left and right keys are pressed and move paddle by 7pixels and check for wall
   if (rightPressed && paddleX < canvas.width-paddleW) {
      paddleX += 7;
   }
   else if (leftPressed && paddleX > 0) {
      paddleX -= 7;
   }



   x += dx;
   y += dy;
   requestAnimationFrame(draw);
}

draw();
//replace setInterval with draw function which is called by requestAnimationFrame(draw) and browser now controls the frame rate
// produces a smoother animation rate than setInterval method
