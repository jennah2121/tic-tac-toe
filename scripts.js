//global variables
var playerTurn = 'X';
var board = [[],[],[]];
var winner = 'No One';

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
    var win = checkWin(board);

    if(win) {
      this.removeEventListener('click', arguments.callee);
      displayWin(win, ctx);
    }

  });
});

/* FUNCTIONS */

/*
  whereCLicked
  determines where the user clicked on the canvas and set the x and y values accordingly
  also uses the new x and y to determine how the board array should be updated
*/
function whereClicked(ctx) {
  var x = event.clientX - canvas.offsetLeft;
  var y = event.clientY - canvas.offsetTop;

  //variables to determine array indexes of board array to update
  var boardX, boardY;

  if(x >=0 && x <= 150) {
    x = 55;
    boardX = 0;
  } else if(x >= 151 && x <= 300) {
    x = 205;
    boardX = 1;
  } else {
    x = 355;
    boardX = 2;
  }

  if(y >=0 && y <= 150) {
    y = 95;
    boardY = 0;
  } else if(y >= 151 && y <= 300) {
    y = 250;
    boardY = 1;
  } else {
    y = 395;
    boardY = 2;
  }

  makeMove(x, y, ctx, boardX, boardY);
}

//Draws an X or O to canvas depending on whose turn it is & updates board array
function makeMove(x, y, ctx, boardX, boardY) {
  ctx.font = '60px helvetica';

  if(playerTurn == 'X') {
    ctx.fillText('X', x, y);
    board[boardY][boardX] = 'X';
    playerTurn = 'O';
    document.querySelector('#turn').innerHTML = 'O\'s turn ';
  } else {
    ctx.fillText('O', x, y);
    board[boardY][boardX] = 'O';
    playerTurn = 'X';
    document.querySelector('#turn').innerHTML = 'X\'s turn ';
  }
}

//Add win functionality
function checkWin(board) {

  //check for horizontal win
  for(var i=0; i < 3; i++) {
    var string = board[i].join("");
    if(string === 'XXX' || string === 'OOO') {
      winner = string[0];
      return `horizontal${i}`;
    }
  }

  //check for vertical win
  for(var j=0; j < 3; j++) {
    var holder = [];
    for(var k=0; k < 3; k++) {
      holder.push(board[k][j]);
    }
    if(holder.join('') == 'XXX' || holder.join('') == 'OOO') {
      winner = holder[0];
      return `vertical${j}`;
    }
  }

  //check for diagonal win
  var diag1 = [];
  diag1.push(board[0][0], board[1][1], board[2][2]);
  if(diag1.join('') == 'XXX' || diag1.join('') == 'OOO') {
    winner = diag1[0];
    return `diag1`;
  }

  var diag2 = [];
  diag2.push(board[2][0], board[1][1], board[0][2]);
  if(diag2.join('') == 'XXX' || diag2.join('') == 'OOO') {
    winner = diag2[0];
    return `diag2`;
  }

  //handle no win
  var gameState = [...board[0], ...board[1], ...board[2]];
  if(gameState.join('').length == 9) return `draw`;
}

/*
  displayWin() - draws a line to show where the win was on the board
  the switch sets the start(x1, y1) and end(x2, y2) points for the line
*/
function displayWin(winType, ctx) {
  var x1, y1, x2, y2;
  switch(winType) {
    case 'horizontal0':
      x1 = 50; y1 = 73; x2 = 405; y2 = 73;
      break;
    case 'horizontal1':
      x1 = 50; y1 = 227; x2 = 405; y2 = 227;
      break;
    case 'horizontal2':
      x1 = 50; y1 = 370; x2 = 405; y2 = 370;
      break;
    case 'vertical0':
      x1 = 75; y1 = 40; x2 = 75; y2 = 405;
      break;
    case 'vertical1':
      x1 = 225; y1 = 40; x2 = 225; y2 = 405;
      break;
    case 'vertical2':
      x1 = 375; y1 = 40; x2 = 375; y2 = 405;
      break;
    case 'diag1':
      x1 = 40; y1 = 40; x2 = 410; y2 = 410;
      break;
    case 'diag2':
      x1 = 410; y1 = 40; x2 = 40; y2 = 410;
      break;
  }

  ctx.strokeStyle = 'red';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();

  document.querySelector('#turn').innerHTML = `${winner} wins!!`;

  setTimeout(endGame, 1350, ctx);
}

/*
  endGame() - redraws the canvas to show which player won
*/
function endGame(ctx) {
  var loser;

  if(winner == 'X') loser = 'O';
  if(winner == 'O') loser = 'X';

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'limegreen';
  ctx.textAlign = 'center';
  ctx.font = '150px londrina Shadow';
  ctx.fillText(`${winner}`, canvas.width/2, 200);
  ctx.font = '90px londrina Shadow';
  ctx.fillText('WINS!!', canvas.width/2, 300);
  ctx.font = '35px Londrina Shadow';
  ctx.fillStyle = 'red';
  if(loser) ctx.fillText(`${loser} loses`, canvas.width/2, 380);
}
