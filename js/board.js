var Board = function(size) {
  this.current_color = Board.BLACK;
  this.size = size;
  this.board = this.create_board(size);
  this.last_move_passed = false;
  this.in_atari = false;
  this.attempted_suicide = false;
};

Board.EMPTY = 0;
Board.BLACK = 1;
Board.WHITE = 2;

/*
 * Write an alert in #alerts, waits a bit before erasing it
 */
 function alertWrite(alert) {
  var alerts = document.getElementById('alerts');
  var firstAlert = document.getElementsByClassName('alert')[1];
  var muchAlerts = document.querySelectorAll('#alerts .alert').length;
  if (muchAlerts > 5) {
    // remove the first .alert in #alerts before adding a new one
    alerts.removeChild(firstAlert);
    alerts.innerHTML+=alert+"<br>";
  } else {
    document.getElementById('alerts').innerHTML+=alert+"<br>";
  }
}

/*
 * Returns a size x size matrix with all entries initialized to Board.EMPTY
 */
 Board.prototype.create_board = function(size) {
  var m = [];
  for (var i = 0; i < size; i++) {
    m[i] = [];
    for (var j = 0; j < size; j++)
      m[i][j] = Board.EMPTY;
  }
  return m;
};

/*
 * Switches the current player
 */
 Board.prototype.switch_player = function() {
  this.current_color = 
  this.current_color == Board.BLACK ? Board.WHITE : Board.BLACK;
  var turnBlack = document.getElementById('turnBlack');
  var turnWhite = document.getElementById('turnWhite');
  var passbtn = document.getElementById('pass-btn');
  if (this.current_color === 1){
    // Remove .activeTurn from turnWhite and set it to turnBlack
    turnWhite.className="";
    turnBlack.className="activeTurn";
    passbtn.className="passBlue";
  } else if (this.current_color === 2){
     // Remove .activeTurn from turnBlack and set it to turnWhite
     turnBlack.className="";
     turnWhite.className="activeTurn";
     passbtn.className="passRed";
   }
 };

/*
 * At any point in the game, a player can pass and let his opponent play
 */
 Board.prototype.pass = function() {
  if (this.last_move_passed)
    this.end_game();
  else {
    var alert = "<div class='alert'>Le joueur a passé !</div";
    alertWrite(alert);
  }
  this.last_move_passed = true;
  this.switch_player();
};

/*
 * Called when the game ends (both players passed)
 */
 Board.prototype.end_game = function() {
  // Add End score count
  var blackScore = document.querySelectorAll('.black').length;
  blackScore+=0.5;
  var whiteScore = document.querySelectorAll('.white').length;
  if (blackScore > whiteScore){
    var alert = "<div class='alert'>Les deux joueurs ont passé !<br> Les soldats ont gagné !</div";
    alertWrite(alert);
  } else {
    var alert = "<div class='alert'>Les deux joueurs ont passé !<br> Les villageois ont gagné!</div";
    alertWrite(alert);
  }
  var alert = "<div class='alert'>SCORES : Soldats : "+blackScore+"<br> Villageois : "+whiteScore+"</div>";
  alertWrite(alert);
};

/*
 * Attempt to place a stone at (i,j). Returns true if the move was legal
 */
 Board.prototype.play = function(i, j) {
  this.attempted_suicide = this.in_atari = false;

  if (this.board[i][j] != Board.EMPTY)
    return false;

  var color = this.board[i][j] = this.current_color;
  var captured = [];
  var neighbors = this.get_adjacent_intersections(i, j);
  var atari = false;
  var ko = false; // Ko rule is not implemented, due to previous turn detection being a complex thing to do

  var self = this;
  _.each(neighbors, function(n) {
    var state = self.board[n[0]][n[1]];
    if (state != Board.EMPTY && state != color) {
      var group = self.get_group(n[0], n[1]);
      // console.log(group);
      if (group["liberties"] == 0)
        captured.push(group);
      else if (group["liberties"] == 1)
        atari = true;
    }
  });

    // detect suicide
    if (_.isEmpty(captured) && this.get_group(i, j)["liberties"] == 0) {
      this.board[i][j] = Board.EMPTY;
      this.attempted_suicide = true;
      var alert = "<div class='alert'>Le suicide n'est pas permis !</div";
      alertWrite(alert);
      return false;
    }

    var self = this;
    _.each(captured, function(group) {
      _.each(group["stones"], function(stone) {
        self.board[stone[0]][stone[1]] = Board.EMPTY;
      });
      var alert = "<div class='alert'>Un groupe a été capturé !</div";
      alertWrite(alert);
    });

    if (atari)
      this.in_atari = true;

    this.last_move_passed = false;
    this.switch_player();
    return true;
  };

/*
 * Given a board position, returns a list of [i,j] coordinates representing
 * orthagonally adjacent intersections
 */
 Board.prototype.get_adjacent_intersections = function(i , j) {
  var neighbors = []; 
  if (i > 0)
    neighbors.push([i - 1, j]);
  if (j < this.size - 1)
    neighbors.push([i, j + 1]);
  if (i < this.size - 1)
    neighbors.push([i + 1, j]);
  if (j > 0)
    neighbors.push([i, j - 1]);
  return neighbors;
};

/*
 * Performs a breadth-first search about an (i,j) position to find recursively
 * orthagonally adjacent stones of the same color (stones with which it shares
 * liberties). Returns null for if there is no stone at the specified position,
 * otherwise returns an object with two keys: "liberties", specifying the
 * number of liberties the group has, and "stones", the list of [i,j]
 * coordinates of the group's members.
 */
 Board.prototype.get_group = function(i, j) {

  var color = this.board[i][j];
  if (color == Board.EMPTY)
    return null;

    var visited = {}; // for O(1) lookups
    var visited_list = []; // for returning
    var queue = [[i, j]];
    var count = 0;

    while (queue.length > 0) {
      var stone = queue.pop();
      if (visited[stone])
        continue;

      var neighbors = this.get_adjacent_intersections(stone[0], stone[1]);
      var self = this;
      _.each(neighbors, function(n) {
        var state = self.board[n[0]][n[1]];
        if (state == Board.EMPTY)
          count++;
        if (state == color)
          queue.push([n[0], n[1]]);
      });

      visited[stone] = true;
      visited_list.push(stone);
    }

    return {
      "liberties": count,
      "stones": visited_list
    };
  }
