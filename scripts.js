//global variables
var playerTurn = 'X';
var board = [[],[],[]];
var winner = 'No One';
var canvas;
var ctx;
var mode;
var isPC;

document.addEventListener("DOMContentLoaded", function() {
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');

  var restart = document.querySelector('#restart');
  restart.addEventListener('click', restartGame);

 gameChoices();
});

/* FUNCTIONS */

//restarts the game
function restartGame() {
  //reset certain variables for purposes of new game
  board = [[],[],[]];
  playerTurn = 'X';
  winner = 'No One';

  document.querySelector('#turn').style.visibility = 'visible';
  document.querySelector('#turn').innerHTML = 'X starts';

  //reset and hide the circles
  var circles = document.querySelectorAll('.circle');
  for(var circle of circles) {
    circle.style.visibility = 'hidden';
    circle.style.animation = 'none';
  }
  //remove canvas event listener
  canvas.removeEventListener('click', canvasClick);

  gameChoices();
}

/*
  gameChoices() - Lets user chose to play against the PC or with a friend
*/
function gameChoices() {
  //Using canvas ask the player who they will play with
  ctx.clearRect(0, 0,canvas.width, canvas.height);
  ctx.fillStyle = 'linen';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.font = '50.5px Amatic sc';
  ctx.fillText(`Welcome to Tic Tac Toe!`, canvas.width/2, 100);
  ctx.fillText(`Who will you play with?`, canvas.width/2, 200);

  ctx.shadowColor = 'lightGrey';
  ctx.shadowOffsetY = 4;
  ctx.shadowBlur = 2;
  ctx.fillStyle = 'lavender';
  ctx.fillRect(75, 260, 125, 40);
  ctx.fillRect(260, 260, 125, 40);

  ctx.fillStyle = 'black';
  ctx.font = '30px Amatic sc';
  ctx.shadowOffsetY = 0;
  ctx.fillText(`A friend`, 137, 290);
  ctx.fillText(`The PC`, 322, 290);

  //Add a click event listener to determine which mode was chosen
  canvas.addEventListener('click', chosenMode);
}

/*
  chosenMode() - run the game depending on the users chosen mode
*/
function chosenMode() {
  mode = whichbutton();

  if(mode) {
    mode == 'left' ? mode = 'friend' : mode = 'pc';

    //set the game up for playing with a friend
    if(mode == 'friend') {
      this.removeEventListener('click', chosenMode);
      ctx.fillStyle = 'linen';
      ctx.fillRect(0,0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.font = '45px Amatic sc';
      ctx.fillText('You are playing with a friend', canvas.width/2, 150);
      ctx.fillText('X will go first', canvas.width/2, 250);
      setTimeout(init, 2000);
    }

    if(mode == 'pc') {
      //remove the old click listener so the next choice can be correctly identified
      this.removeEventListener('click', chosenMode);

      //Ensure the PC makes the first move
      isPC = true;

      //Ask user to chose their icon
      ctx.fillStyle = 'linen';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.font = '50.5px Amatic sc';
      ctx.fillText(`Will you play as X or O?`, canvas.width/2, 150);

      ctx.shadowColor = 'lightGrey';
      ctx.shadowOffsetY = 4;
      ctx.shadowBlur = 2;
      ctx.fillStyle = 'lavender';
      ctx.fillRect(75, 260, 125, 40);
      ctx.fillRect(260, 260, 125, 40);

      ctx.fillStyle = 'black';
      ctx.font = '30px Amatic sc';
      ctx.shadowOffsetY = 0;
      ctx.fillText(`X`, 137, 290);
      ctx.fillText(`O`, 322, 290);

      this.addEventListener('click', iconSelection);
    }
  }
}

function whichbutton() {
  var x = event.clientX-event.target.offsetLeft;
  var y = event.clientY - event.target.offsetTop;
  if(x >= 77 && x <= 197 && y >= 262 && y <= 297) return 'left';
  if(x >= 262 && x <= 381 && y >= 262 && y <= 297) return 'right';
}

function iconSelection() {
  playerIcon = whichbutton();

  if(playerIcon) {
      playerIcon == 'left' ? (playerTurn = 'O', playerIcon = 'X' ): (playerTurn = 'X', playerIcon = 'O');
      this.removeEventListener('click', iconSelection);
      ctx.fillStyle = 'linen';
      ctx.fillRect(0,0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.font = '45px Amatic sc';
      ctx.fillText('You are playing with the PC', canvas.width/2, 150);
      ctx.fillText(`You chose to be ${playerIcon}`, canvas.width/2, 250);
      setTimeout(init, 2000);
    }
}



/*
  init() - Runs as soon as the DOM loads or if user wants to restart
*/
function init() {
  //set up the canvas
  ctx.clearRect(0, 0,canvas.width, canvas.height);

  ctx.lineCap = 'round';
  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'black';
  ctx.lineWidth = 4;
  ctx.textAlign = 'start';

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

  //If the mode is PC, make the first PC move
  if(isPC) {
    whereClicked();
  }

  canvas.addEventListener('click', canvasClick);
}

//detect the canvas being clicked
function canvasClick() {
  whereClicked();
  var win = checkWin(board);

  if(win) {
    this.removeEventListener('click', canvasClick);
    isPC = false;
    displayWin(win);
  }

  setTimeout(function(){
    // ensures that the PC moves after the player until game over
    if(isPC) {
      whereClicked();
      var win = checkWin(board);

      if(win) {
        canvas.removeEventListener('click', canvasClick);
        displayWin(win);
      }
    }
  }, 1000);
}

/*
  whereCLicked
  determines where the user clicked on the canvas and set the x and y values accordingly
  also uses the new x and y to determine how the board array should be updated
*/
function whereClicked() {
  //varaibles to store location of actual click or values generated for 'click'
  var x, y;

  //variables to determine array indexes of board array to update
  var boardX, boardY;

  if(isPC) {
    var isWinMove = winMovePoss(playerTurn);
    var needToBlock = winMovePoss(playerIcon);

    if(isWinMove) {
      //play a winning move if available
      boardX = isWinMove[0];
      boardY = isWinMove[1];
    } else if(needToBlock) {
      //block if opponent needs blocking
      boardX = needToBlock[0];
      boardY = needToBlock[1];
    } else {
      //play a random move
      x = Math.floor(Math.random() * (450 - 0 + 1)) + 0;
      y = Math.floor(Math.random() * (450 - 0 + 1)) + 0;
    }
  } else {
    x = event.clientX - canvas.offsetLeft;
    y = event.clientY - canvas.offsetTop;
  }

  if(x >=0 && x <= 150 || boardX == 0) {
    x = 55;
    boardX = 0;
  } else if(x >= 151 && x <= 300 || boardX == 1) {
    x = 205;
    boardX = 1;
  } else {
    x = 355;
    boardX = 2;
  }

  if(y >=0 && y <= 150 || boardY == 0) {
    y = 95;
    boardY = 0;
  } else if(y >= 151 && y <= 300 || boardY == 1) {
    y = 250;
    boardY = 1;
  } else {
    y = 395;
    boardY = 2;
  }

  if(board[boardY][boardX] == undefined) {
    if(mode == 'pc') isPC == true ? isPC = false : isPC = true;
  }

  makeMove(x, y, boardX, boardY);
}

// PC will check for a winning move and play that move if it exists
function winMovePoss(icon) {
  //create copy of board values
  var testBoard = [];
  for (var x = 0; x < board.length; x++) {
    testBoard[x] = board[x].slice();
  }

  for(var i=0; i<3; i++) {
    for(var j=0; j<3; j++) {
      if(testBoard[i][j] == undefined) {
        testBoard[i][j] = icon;
        if(checkWin(testBoard)) {
          //reset winner as move was a simulated one
          winner = 'No One';
          //j is boardX val, i is boardY val
          return [j, i];
        }
        testBoard[i][j] = undefined;
      }
    }
  }
}

//Draws an X or O to canvas depending on whose turn it is & updates board array
function makeMove(x, y, boardX, boardY) {
  ctx.font = '80px Amatic Sc';
  var turn = document.querySelector('#turn');

if(!board[boardY][boardX]) {
    if(playerTurn == 'X') {
      ctx.fillText('X', x, y);
      board[boardY][boardX] = 'X';
      playerTurn = 'O';

      if(mode == 'pc') {
        isPC == true ? turn.innerHTML = 'PC\'s turn ' : turn.innerHTML = 'Your turn ';
      } else {
        turn.innerHTML = 'O\'s turn ';
      }

    } else {
      ctx.fillText('O', x, y);
      board[boardY][boardX] = 'O';
      playerTurn = 'X';

      if(mode == 'pc') {
        isPC == true ? turn.innerHTML = 'PC\'s turn ' : turn.innerHTML = 'Your turn ';
      } else {
        turn.innerHTML = 'X\'s turn ';
      }
    }
  }
}

//Add win functionality
function checkWin(checkBoard) {

  //check for horizontal win
  for(var i=0; i < 3; i++) {
    var string = checkBoard[i].join("");
    if(string === 'XXX' || string === 'OOO') {
      winner = string[0];
      return `horizontal${i}`;
    }
  }

  //check for vertical win
  for(var j=0; j < 3; j++) {
    var holder = [];
    for(var k=0; k < 3; k++) {
      holder.push(checkBoard[k][j]);
    }
    if(holder.join('') == 'XXX' || holder.join('') == 'OOO') {
      winner = holder[0];
      return `vertical${j}`;
    }
  }

  //check for diagonal win
  var diag1 = [];
  diag1.push(checkBoard[0][0], checkBoard[1][1], checkBoard[2][2]);
  if(diag1.join('') == 'XXX' || diag1.join('') == 'OOO') {
    winner = diag1[0];
    return `diag1`;
  }

  var diag2 = [];
  diag2.push(checkBoard[2][0], checkBoard[1][1], checkBoard[0][2]);
  if(diag2.join('') == 'XXX' || diag2.join('') == 'OOO') {
    winner = diag2[0];
    return `diag2`;
  }

  //handle no win
  var gameState = [...checkBoard[0], ...checkBoard[1], ...checkBoard[2]];
  if(gameState.join('').length == 9) return `draw`;
}

/*
  displayWin() - draws a line to show where the win was on the board
  the switch sets the start(x1, y1) and end(x2, y2) points for the line
*/
function displayWin(winType) {
  var x1, y1, x2, y2;
  switch(winType) {
    case 'horizontal0':
      x1 = 45; y1 = 63; x2 = 385; y2 = 63;
      break;
    case 'horizontal1':
      x1 = 45; y1 = 217; x2 = 385; y2 = 217;
      break;
    case 'horizontal2':
      x1 = 45; y1 = 363; x2 = 385; y2 = 363;
      break;
    case 'vertical0':
      x1 = 68; y1 = 30; x2 = 68; y2 = 415;
      break;
    case 'vertical1':
      x1 = 218; y1 = 30; x2 = 218; y2 = 415;
      break;
    case 'vertical2':
      x1 = 368; y1 = 30; x2 = 368; y2 = 415;
      break;
    case 'diag1':
      x1 = 40; y1 = 40; x2 = 410; y2 = 410;
      break;
    case 'diag2':
      x1 = 400; y1 = 30; x2 = 30; y2 = 400;
      break;
  }

  ctx.strokeStyle = 'limegreen';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();

  document.querySelector('#turn').innerHTML = `${winner} wins!!`;

  setTimeout(endGame, 1350, ctx);
  setTimeout(showCircles);
}

/*
  endGame() - redraws the canvas to show which player won
*/
function endGame() {
  var loser;

  if(winner == 'X') loser = 'O';
  if(winner == 'O') loser = 'X';

  ctx.fillStyle = 'linen';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'limegreen';
  ctx.textAlign = 'center';
  ctx.font = '150px londrina Shadow';
  ctx.fillText(`${winner}`, canvas.width/2, 200);
  ctx.font = '90px londrina Shadow';
  ctx.fillText('WINS!!', canvas.width/2, 300);
  ctx.font = '35px Amatic SC';
  ctx.fillStyle = 'red';
  if(loser) ctx.fillText(`${loser} loses`, canvas.width/2, 380);

  document.querySelector('#turn').style.visibility = 'hidden';

  //automatically restart the game
  setTimeout(restartGame, 4500);
}

/*
  showCircles() - displays floating circles with the winner inside
*/

function showCircles() {
  var circles = document.querySelectorAll('.circle');
  var num = -1;
  for(var circle of circles) {
    var speeds = ['2.5s', '4s', '3s', '3.75s', '2s', '3s'];
    num++;
    circle.style.visibility = 'visible';
    circle.style.animation = `riseUp ${speeds[num]} infinite alternate linear`;
    winner == 'No One' ? circle.innerHTML = winner : circle.innerHTML = `${winner} wins!`
  }
}
