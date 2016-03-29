// Enemies our player must avoid
var Enemy = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -101;
    this.y = randomRowY();
    this.speed = randomSpeed();
};
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if (this.x > 505) {
        this.x = -101;
    } else {
        this.x = this.x + (this.speed * dt);
    }
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.strokeStyle = 'red';
    //ctx.strokeRect(this.x, this.y+72, 101, 83);
};
//Enemy dies
Enemy.prototype.die = function() {
    this.x = -101;
}
//return random entry of array
function randomArrayEntry(inArray) {
  return inArray[Math.floor(Math.random()*inArray.length)];
};
//generate random row for enemy
function randomRowY() {
    var rows = Array(1, 2, 3);
    return (randomArrayEntry(rows) * 83) - 23;
};
//generate random speed for enemy
function randomSpeed() {
    return (Math.random() * (11 - 1) + 1) * 50;
    //return (Math.random() * (11 - 1) + 1);
};
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 404;
};
//TODO area of the player's sprite which is collisionable
//hotX = this.x + 10;
//hotY = this.y + 10;
// Draw the enemy on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.strokeStyle = 'green';
    //ctx.strokeRect(this.x, this.y+61, 101, 83);
};
// move the player depending on which direction let is pressed
Player.prototype.handleInput = function(dir) {
  switch(dir) {
    case 'up':
        if (this.y > 0) {
            this.y = this.y - 83;
            if (this.y < 72) {
                this.win();
            }
        }
        break;
    case 'down':
        if (this.y < 400) {
          this.y = this.y + 83;
        }
        break;
    case 'left':
        if (this.x > 100) {
          this.x = this.x - 101;
        }
        break;
    case 'right':
        if (this.x < 400) {
          this.x = this.x + 101;
        }
        break;
  }
};
//player dies
Player.prototype.die = function() {
    score.decrease();
    this.x = 202;
    this.y = 404;
}
//player gets to water
Player.prototype.win = function() {
    score.increase();
    this.x = 202;
    this.y = 404;
}
//Score
var Score = function() {
    this.score = 0;
};
Score.prototype.render = function() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 505, 50);
    ctx.font = "32pt arial";
    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.strokeText('Score: ' + this.score, 10, 40);
    ctx.strokeRect(0, 0, 505, 50);
};
//Score decrease
Score.prototype.decrease = function() {
    this.score--;
    this.render();
};
//score increase
Score.prototype.increase = function() {
    this.score=+10;
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

checkCollisions = function() {
    allEnemies.forEach(function(enemy) {

        var A = [enemy.x, enemy.y + 71];
        var B = [enemy.x + 101, enemy.y + 71];
        var C = [enemy.x + 101, enemy.y + 83 + 71];
        var D = [enemy.x, enemy.y + 83 + 71];

        var W = [player.x, player.y + 61];
        var X = [player.x + 101, player.y + 61];
        var Y = [player.x + 101, player.y + 83 + 55];
        var Z = [player.x, player.y + 83 + 55];

        if (enemy.x > 0 && enemy.x < 505) {
            if (checkPointInRectangle(A, B, C, D, W) ||
                checkPointInRectangle(A, B, C, D, X) ||
                checkPointInRectangle(A, B, C, D, Y) ||
                checkPointInRectangle(A, B, C, D, Z)) {
                enemy.die();
                player.die();

            };
        }
    });
};
checkPointInRectangle = function(A, B, C, D, P){

    //reference: https://martin-thoma.com/how-to-check-if-a-point-is-inside-a-rectangle/
    //
    //area of enemy rectangle, I could have used the simple rectangle aligned with x-y axis formula but
    //this is fun and who knows, maybe I will need it :)
    //           = 0.5           | (yA   - yC  )�(xD   - xB  )  +  (yB   - yD  )�(xA   - xC)|
    var areaRect = 0.5 * Math.abs(((A[1] - C[1])*(D[0] - B[0])) + ((B[1] - D[1])*(A[0] - C[0])));

    // area of triangle
    //      = 0.5
    //    (x1 (y2-y3)
    //  +  x2 (y3-y1)
    //  +  x3 (y1-y2))
    var ABP = 0.5 * Math.abs(
          A[0] * (B[1] - P[1])
        + B[0] * (P[1] - A[1])
        + P[0] * (A[1] - B[1]));

    var BCP = 0.5 * Math.abs(
          (B[0] * (C[1] - P[1]))
        + (C[0] * (P[1] - B[1]))
        + (P[0] * (B[1] - C[1])));

    var CDP = 0.5 * Math.abs(
          (C[0] * (D[1] - P[1]))
        + (D[0] * (P[1] - C[1]))
        + (P[0] * (C[1] - D[1])));

    var DAP = 0.5 * Math.abs(
          (D[0] * (A[1] - P[1]))
        + (A[0] * (P[1] - D[1]))
        + (P[0] * (D[1] - A[1])));

    var totTri = ABP+BCP+CDP+DAP;

    return areaRect == totTri;

}

