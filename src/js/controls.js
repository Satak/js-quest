function moveLeft() {
  player.move(-pixelSize, 0);
}

function moveRight() {
  player.move(pixelSize, 0);
}

function moveUp() {
  player.move(0, -pixelSize);
}

function moveDown() {
  player.move(0, pixelSize);
}

function pickUp() {
  player.pickUp();
}

function showInventory() {
  player.showInventory();
}

function checkKey(e) {
  e = e || window.event;
  const actionMap = {
    '37': () => player.move(-pixelSize, 0), // left arrow
    '38': () => player.move(0, -pixelSize), // up arrow
    '39': () => player.move(pixelSize, 0), // right arrow
    '40': () => player.move(0, pixelSize), // down arrow
    '80': () => player.pickUp(), // p key to Pick Up items
    '73': () => player.showInventory(), // i key to show inventory
    '71': () => console.table(gameArea.components), // g key to show game components in console.table
  };

  const action = actionMap[e.keyCode];
  if (action && player.hp > 0) action();
}

document.onkeydown = checkKey;
