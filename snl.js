width = 9;
height = 9; //10x10 board dimensions (n-1 units for a n x n board)

//Rolls Dice
let won = false;
function rollDice(){
    if(won){
        return;
    }

    let currentPlayer = players[currentPlayerTurn];
    roll = Math.floor(Math.random() * 6 + 1); //Rolls a dice to generate a random number between 1 and 6
    console.log(currentPlayer.name +", You rolled", roll); //keeping track of rolls

    if(currentPlayer.position == 0 && roll != 6){
        currentPlayer.position = 0;
        console.log('Need a 6 to begin!');
    } else{
        currentPlayer.position += roll; //move the player accordingly

        //interact with elements
        elements.forEach(element =>{
            if(element.start == currentPlayer.position){
                currentPlayer.position = element.end;
            }
        })

        //win criteria
        if(currentPlayer.position == 99){
            console.log(currentPlayer.name + " WINS!");
            won = true;
        }

        //if it is any other position
        if (currentPlayer.position === position) {
            diff = currentPlayer.position - position;
            currentPlayerPosition = position - diff;
        }
    }

    currentPlayerTurn++;
    if (currentPlayerTurn >= players.length) {
        currentPlayerTurn = 0;
    }

    drawBoard()
}


//two players, hard coded for ease
players = [{name: "Vishrut", position: 0, color: "gold"}, {name: "AI", position: 0, color: "brown"}];
let currentPlayerTurn = 0;


//Board properties
boardSize = 60;
board = []; //Initializing the play area
let position = 0; //indices of each cell in the array
let darkBox = false; //alternating pattern
//Generating random ladders and snakes
ladders = []; //6 ladders and 6 snakes
for (let i = 0; i <= 5; i++){
    let start =  Math.floor(Math.random() * 97 + 1); //Random number between 1 and 99
    let end = Math.floor(Math.random() * (99 - start)) + start; //Random number between start and 99 to push player up
    ladders.push({'start': start, 'end': end});
}
snakes = []
for (let i = 0; i <= 5; i++){
    let start =  Math.floor(Math.random() * 97 + 1); //Random number between 1 and 99
    let end = Math.floor(Math.random() * (start - 1)) + 1; //Random number between 1 and start to pull player down
    snakes.push({'start': start, 'end': end});
}
elements = snakes.concat(ladders); //merge the elements

// Board cells
for (var y = height; y >= 0; y--) {
  let row = [];

  board.push(row);
  for (var x = 0; x < width; x++) {
    row.push({x, y, occupied: null, position, color: darkBox ? "#c68c53" : "#ecd9c6"});
    darkBox = !darkBox; //next one is not dark box
    position++;
  }
}

function drawBoard(){
    let boardOnScreen = ``;
  board.forEach(row => {
    row.forEach(square => {
      boardOnScreen += `<div class=square style="top:${square.y * boardSize}px; left:${square.x * boardSize}px; background-color:${square.color}"></div>`;
    });
  });

  players.forEach(player => {
    let square = null;
    board.forEach(row => {
      row.forEach(square => {
        if (square.position === player.position) {
          boardOnScreen += `<div class=player style="top:${square.y * boardSize + 5}px; left:${square.x * boardSize + 5}px;background-color:${player.color}"></div>`;
        }
      });
    });
  });

  elements.forEach(element => {
    //let start = 0;
    let startPos = { x: 0, y: 0 };
    let endPos = { x: 0, y: 0 };

    board.forEach(row => {
      row.forEach(square => {
        if (square.position === element.start) {
          startPos.x = square.x * boardSize;
          startPos.y = square.y * boardSize;
        }

        if (square.position === element.end) {
          endPos.x = square.x * boardSize;
          endPos.y = square.y * boardSize;
        }
      });
    });

    isLadder = element.end > element.start; //checks if snake or ladder
    drawLine({ color: isLadder ? "white" : "red", startPos, endPos });
  });
  //get everything on the page
  document.getElementById("board").innerHTML = boardOnScreen;

}

//Drawing elements
function drawLine({color, startPos, endPos}){
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(startPos.x, startPos.y); //starting coordinates
    ctx.lineTo(endPos.x, endPos.y); //target coordinates
    ctx.lineWidth = 10;
    ctx.strokeStyle = color;
    ctx.stroke();
}

drawBoard()