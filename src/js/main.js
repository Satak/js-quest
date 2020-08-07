let playerObject;
let orcObject;
let doorObject;
const pixelSize = 25;
const canvasWidth = pixelSize * 7 * 2;
const canvasHeight = pixelSize * 9 * 1;
const components = [];
const basicGreen = '#095709'; //healthy icon color
const frameUpdateMS = 10; // update frames every 10 milliseconds

const gameArea = {
  canvas: document.getElementById('gameArea'),
  start: function () {
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.context = this.canvas.getContext('2d');
    this.interval = setInterval(updateGameArea, frameUpdateMS);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

function startGame() {
  playerObject = new Player(...Object.values(playerStats));
  orcObject = new Character(...Object.values(orcStats));
  dragonObject = new Character(...Object.values(dragonStats));
  doorObject = new Component(
    ...Object.values(door),
    pixelSize * 5,
    pixelSize * 3
  );

  keyObject = new Component(
    ...Object.values(key),
    pixelSize * 6,
    pixelSize * 7
  );

  keyObject.block = false;
  keyObject.canPickUp = true;

  components.push(orcObject);
  components.push(dragonObject);
  components.push(doorObject);
  components.push(keyObject);
  components.push(playerObject);

  gameArea.start();
}

function updateGameArea() {
  gameArea.clear();
  components.forEach((comp) => comp.update());
}

function moveLeft() {
  playerObject.move(-pixelSize, 0);
}

function moveRight() {
  playerObject.move(pixelSize, 0);
}

function moveUp() {
  playerObject.move(0, -pixelSize);
}

function moveDown() {
  playerObject.move(0, pixelSize);
}

function checkKey(e) {
  e = e || window.event;
  const actionMap = {
    '37': () => playerObject.move(-pixelSize, 0), // left arrow
    '38': () => playerObject.move(0, -pixelSize), // up arrow
    '39': () => playerObject.move(pixelSize, 0), // right arrow
    '40': () => playerObject.move(0, pixelSize), // down arrow
    '80': () => playerObject.pickUp(), // p key to Pick Up items
    '73': () => playerObject.showInventory(), // i key to show inventory
  };

  const action = actionMap[e.keyCode];
  if (action && playerObject.hp > 0) action();
}

document.onkeydown = checkKey;
