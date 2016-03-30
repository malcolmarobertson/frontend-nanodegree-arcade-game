'use strict';

var MAX_BLOCK_WIDTH = 101;
var MAX_CANVAS_WIDTH = 505;
var ROW_HEIGHT = 83;
var ROW_HEIGHT_ADJUST = 23;
var SPEED_ADJUST = 50;
var PLAYER_START_X = 202;
var PLAYER_START_Y = 404;
var MIN_PLAYER_X = 100;
var MIN_PLAYER_Y = 72;
var MAX_PLAYER_X = 400;
var MAX_PLAYER_Y = 400;
var WIN_SCORE = 10;
var ENEMY_ROW_HEIGHT_ADJUST = 71;
var PLAYER_ROW_HEIGHT_ADJUST_1 = 61;
var PLAYER_ROW_HEIGHT_ADJUST_2 = 55;

//super class for game objects
var GameObject = function (sprite, x, y) {
    this.sprite = sprite;
    this.x = x
    this.y = y;
};
// Enemies our player must avoid
var Enemy = function() {
    GameObject.call(this, 'images/enemy-bug.png', -MAX_BLOCK_WIDTH, this.randomRowY());
    this.speed = this.randomSpeed();
};
Enemy.prototype = Object.create(GameObject.prototype);
Enemy.prototype.constructor = Enemy;
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x > MAX_CANVAS_WIDTH) {
        this.x = -MAX_BLOCK_WIDTH;
    } else {
        this.x = this.x + (this.speed * dt);
    }
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.strokeStyle = 'red';
    //ctx.strokeRect(this.x, this.y+MIN_PLAYER_Y, MAX_BLOCK_WIDTH, ROW_HEIGHT);
};
//Enemy dies
Enemy.prototype.die = function() {
    this.x = -MAX_BLOCK_WIDTH;
};
//return random entry of array
Enemy.prototype.randomArrayEntry = function(inArray) {
  return inArray[Math.floor(Math.random()*inArray.length)];
};
//generate random row for enemy
Enemy.prototype.randomRowY = function() {
    var rows = Array(1, 2, 3);
    return (this.randomArrayEntry(rows) * ROW_HEIGHT) - ROW_HEIGHT_ADJUST;
};
//generate random speed for enemy
Enemy.prototype.randomSpeed = function() {
    return (Math.random() * (11 - 1) + 1) * SPEED_ADJUST;
    //return (Math.random() * (11 - 1) + 1);
};
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    GameObject.call(this, 'images/char-boy.png', PLAYER_START_X, PLAYER_START_Y);
};
Player.prototype = Object.create(GameObject.prototype);
Player.prototype.constructor = Player;
//TODO area of the player's sprite which is collisionable
//hotX = this.x + 10;
//hotY = this.y + 10;
// Draw the enemy on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.strokeStyle = 'green';
    //ctx.strokeRect(this.x, this.y+61, MAX_BLOCK_WIDTH, ROW_HEIGHT);
};
// move the player depending on which direction let is pressed
Player.prototype.handleInput = function(dir) {
  switch(dir) {
    case 'up':
        if (this.y > 0) {
            this.y = this.y - ROW_HEIGHT;
            if (this.y < MIN_PLAYER_Y) {
                this.win();
            }
        }
        break;
    case 'down':
        if (this.y < MAX_PLAYER_Y) {
          this.y = this.y + ROW_HEIGHT;
        }
        break;
    case 'left':
        if (this.x > MIN_PLAYER_X) {
          this.x = this.x - MAX_BLOCK_WIDTH;
        }
        break;
    case 'right':
        if (this.x < MAX_PLAYER_X) {
          this.x = this.x + MAX_BLOCK_WIDTH;
        }
        break;
  }
};
//player dies
Player.prototype.die = function() {
    score.decrease();
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;
};
//player gets to water
Player.prototype.win = function() {
    score.increase();
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;
};
//Score
var Score = function() {
    this.score = 0;
};
Score.prototype.render = function() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, MAX_CANVAS_WIDTH, 50);
    ctx.font = "32pt arial";
    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.strokeText('Score: ' + this.score, 10, 40);
    ctx.strokeRect(0, 0, MAX_CANVAS_WIDTH, 50);
};
//Score decrease
Score.prototype.decrease = function() {
    this.score--;
    this.render();
};
//score increase
Score.prototype.increase = function() {
    this.score=+WIN_SCORE;
    this.render();
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var nme1 = new Enemy();
allEnemies.push(nme1);
var nme2 = new Enemy();
allEnemies.push(nme2);
var nme3 = new Enemy();
allEnemies.push(nme3);

var player = new Player();

var score = new Score();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});



