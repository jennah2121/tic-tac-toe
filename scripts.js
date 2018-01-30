//global variables
var playerTurn = 'X';

document.addEventListener("DOMContentLoaded", function() {
  //set up the canvas
  var canvas = document.querySelector('#canvas');
  var ctx = canvas.getContext('2d');

  ctx.lineCap = 'round';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 4;

  //draw the starting game board - vetical lines followed by horizontal
  ctx.beginPath();
  ctx.moveTo(150, 0);
  ctx.lineTo(150, 450);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(300, 0);
  ctx.lineTo(300, 450);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(0, 150);
  ctx.lineTo(450, 150);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.lineTo(450, 300);
  ctx.stroke();
  ctx.closePath();

  //add a click event listener to canvas
  canvas.addEventListener('click', function() {
    whereClicked(ctx);
  });
});

/* FUNCTIONS */

//determines where the user clicked on the canvas and set the x and y values accordingly
function whereClicked(ctx) {
  var x = event.clientX - canvas.offsetLeft;
  var y = event.clientY - canvas.offsetTop;

  if(x >=0 && x <= 150) {
    x = 55;
  } else if(x >= 151 && x <= 300) {
    x = 205;
  } else {
    x = 355;
  }

  if(y >=0 && y <= 150) {
    y = 95;
  } else if(y >= 151 && y <= 300) {
    y = 250;
  } else {
    y = 395;
  }

  makeMove(x, y, ctx);
}

//Draws an X or O to canvas depending on whose turn it is
function makeMove(x, y, ctx) {
  ctx.font = '60px helvetica';

  if(playerTurn == 'X') {
    ctx.fillText('X', x, y);
    playerTurn = 'O';
    document.querySelector('#turn').innerHTML = 'O\'s ';
  } else {
    ctx.fillText('O', x, y);
    playerTurn = 'X';
    document.querySelector('#turn').innerHTML = 'X\'s ';
  }
}
