/* HETIC-P2019-Go - Roadmap and planning */

// Problem : Create a Game of Go in JS, in the form of a web application
/* Functionnalities : 
- Save/load game into 'partie.txt' file
- Can be played against another human or an AI opponent
- Basic Go rules detection : like atari, ko, etc.
- Score count
- End-game detection and winner/loser declaration
*/

/* Game preparation planning 
  Display menu, options :
    - New game, options :
      - opponent : human (local) / AI (local) / human (online - to be implemented) ;
      - goban size : 19x19 / 13x13 / 9x9 ;
      - time-on-attack : true/false; 
    - Load game : 
      - load game from partie.txt ;
    - Miscellaneous options ;
*/

/* Goban generation planning
  - Detect user options input ;
  - Render goban (19x19 / 13x13 / 9x9) :
    - trace the background (yellowish traditional board) ;
    - trace the lines (black thin lines) ; 
    - trace the hoshis (4 are 4,4 from each angle, 4 are 4,10 between angles, one is at the center 10,10) (black thin but visible dots) ;
    - register x,y coordinates of each position ;
  - Set black stones as the first player ;
*/


// Global board vars
var goban = {
  size: 9,  // 19/13/9;
  opponent: 'human',  // 'human'/'ai'/'online' local human by default
  timeonattack: false, // false/true false by default
  turn: 'b' // 'b'/'w', black starts
}
var boardContainer = document.getElementById('boardContainer');
var boardSquare = $('.boardSquare');
var blackPlayer = {
  stone: "<div class='blackStone stone' x-data='0' y-data='0'></div>",  // stone element to be added to the html
}
var whitePlayer = {
  stone: "<div class='whiteStone stone' x-data='0' y-data='0'></div>",  // stone element to be added to the html
}


// Goban generation function, depends on goban.size var only
function gobanGen() {
  iy = 0;
  ix = 0;
  for (var iy=0; iy<goban.size; iy++) {
    for (var ix=0; ix<goban.size ; ix++) {
      boardContainer.innerHTML+="<div class='boardSquare' x-data="+ix+" y-data="+iy+"></div>";
      hoshiGen();
    }
    boardContainer.innerHTML+="<br>";
  };
}
gobanGen();

function hoshiGen() {
  // Will check for coordinates of last intersection placed
  // If coordinates are in the hoshi group, assign .hoshi class to it
  var lastSquareX = boardContainer.lastChild.getAttribute('x-data');
  var lastSquareY = boardContainer.lastChild.getAttribute('y-data');
  switch(goban.size) {
    case 19:  // If goban.size = 19, trace 9 hoshis
      if (
        ((boardContainer.lastChild.getAttribute('x-data') == 3) && boardContainer.lastChild.getAttribute('y-data') == 3) || 
        ((boardContainer.lastChild.getAttribute('x-data') == 3) && boardContainer.lastChild.getAttribute('y-data') == 9) || 
        ((boardContainer.lastChild.getAttribute('x-data') == 3) && boardContainer.lastChild.getAttribute('y-data') == 15) || 
        ((boardContainer.lastChild.getAttribute('x-data') == 9) && boardContainer.lastChild.getAttribute('y-data') == 3) || 
        ((boardContainer.lastChild.getAttribute('x-data') == 9) && boardContainer.lastChild.getAttribute('y-data') == 9) ||
        ((boardContainer.lastChild.getAttribute('x-data') == 9) && boardContainer.lastChild.getAttribute('y-data') == 15) ||
        ((boardContainer.lastChild.getAttribute('x-data') == 15) && boardContainer.lastChild.getAttribute('y-data') == 3) ||
        ((boardContainer.lastChild.getAttribute('x-data') == 15) && boardContainer.lastChild.getAttribute('y-data') == 9) ||
        ((boardContainer.lastChild.getAttribute('x-data') == 15) && boardContainer.lastChild.getAttribute('y-data') == 15) )
      {
        boardContainer.lastChild.classList.add('hoshi');
      };
      break;
    case 13: // If goban.size = 13, trace 9 hoshis
      if (
        ((boardContainer.lastChild.getAttribute('x-data') == 3) && boardContainer.lastChild.getAttribute('y-data') == 3) || 
        ((boardContainer.lastChild.getAttribute('x-data') == 3) && boardContainer.lastChild.getAttribute('y-data') == 6) || 
        ((boardContainer.lastChild.getAttribute('x-data') == 3) && boardContainer.lastChild.getAttribute('y-data') == 9) || 
        ((boardContainer.lastChild.getAttribute('x-data') == 6) && boardContainer.lastChild.getAttribute('y-data') == 3) || 
        ((boardContainer.lastChild.getAttribute('x-data') == 6) && boardContainer.lastChild.getAttribute('y-data') == 6) ||
        ((boardContainer.lastChild.getAttribute('x-data') == 6) && boardContainer.lastChild.getAttribute('y-data') == 9) ||
        ((boardContainer.lastChild.getAttribute('x-data') == 9) && boardContainer.lastChild.getAttribute('y-data') == 3) ||
        ((boardContainer.lastChild.getAttribute('x-data') == 9) && boardContainer.lastChild.getAttribute('y-data') == 6) ||
        ((boardContainer.lastChild.getAttribute('x-data') == 9) && boardContainer.lastChild.getAttribute('y-data') == 9) )
      {
        boardContainer.lastChild.classList.add('hoshi');
      };
      break;
    case 9: // If goban.size = 9, trace 4 hoshis
      if (
          ((boardContainer.lastChild.getAttribute('x-data') == 1) && boardContainer.lastChild.getAttribute('y-data') == 1) || 
          ((boardContainer.lastChild.getAttribute('x-data') == 1) && boardContainer.lastChild.getAttribute('y-data') == 7) || 
          ((boardContainer.lastChild.getAttribute('x-data') == 7) && boardContainer.lastChild.getAttribute('y-data') == 1) || 
          ((boardContainer.lastChild.getAttribute('x-data') == 7) && boardContainer.lastChild.getAttribute('y-data') == 7)) 
      {
        boardContainer.lastChild.classList.add('hoshi');
      };
      break;
  }
}


// Stone generation and placement function 
//  1. Gets X-Y coordinates of clicked board intersection
//  2. Set those coordinates to temp var "currentCoordinates"
//  3. Place stone with those targeted coordinates, adequate color and characteristics
boardContainer.addEventListener('click', function (event) {
  boardContainer.innerHTML+="<div class='blackStone stone' x-data="+event.target.getAttribute('x-data')+" y-data="+event.target.getAttribute('y-data')+"></div>";
  console.log('Stone placed');
  console.log("X:"+event.target.getAttribute('x-data') +" , "+ "Y:"+event.target.getAttribute('y-data'));
});


/* Turn by turn planning
  Each turn :
    - Detect which player is playing, and select the right vars to current vars;
    - Detect player input (mouseclick) on the goban -> x,y ;
    - Approximate player input to nearest goban intersection -> x,y ;
    - Place a stone (black if black turn, white if white turn) ;
    - Study adjacent stones to know if there's stones captured, or atari/ko/seki ;
    - Update the goban and the stones already placed on it ;
    - Reset the pass counter to 0 ;
    - BUT : The player always has the choice to pass, which finishes his turn immediately -> Add 1 to the pass counter
      - If two players pass consecutively (i.e pass counter == 2) -> End condition = true -> Game is finished ;
    - Set the turn to the other player (if black just played, it's white's turn) ;
*/

/* Stones interaction planning 
  - When a stone is placed (i.e mouseclick event) :
    - Check adjacent environment : 
      - IF the placed stone has 0 liberties right from the start :
        - The stone is un-placed (suicide is forbidden) ;
        - The player's turn is reset to the point where he can place his stone ;
        - IF the placed stone is adjacent to a stone with the same color :
          - The stones stay alive ;
          - The stones form a group ;
      - IF the placed stone has 1 liberty :
        - This stone is atari ;
        - BUT if an adjacent opponent is atari too : 
          - it's a ko situation ('eternity' in chinese) : IF a player places a stone and capture the other one, the other player will not be allowed to place his next stone to capture the previous stone, to prevent a loop ;
  - IF a stone is placed, no player can place an other stone on the same position ;
  - By default, a stone has 4 liberties (no other stones around it) ;
  - Liberties decrease by the number of stones around it (2 stones adjacent have 3 liberties each) ;
  - 2 adjacent stones with the same color form a group :
    IF one stone of the group dies, the entire group dies ;
  - IF a stone is dead :
    - The stone is removed from the goban ;
    - Any adjacent stones with the same color are dead ;
    - For each dead stone, opponent prisoner score is incremented by 1 ;
*/ 




