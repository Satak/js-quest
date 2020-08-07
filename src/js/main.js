const player = new Player(...Object.values(playerStats));
const gameArea = new GameArea('gameArea', canvasWidth, canvasHeight, frameRate);

function startGame() {
  const orc = new Character(...Object.values(orcStats));
  const dragon = new Character(...Object.values(dragonStats));
  const door = new Component(...Object.values(doorStats));
  const key = new Component(...Object.values(keyStats));

  door.x = pixelSize * 5;
  door.y = pixelSize * 3;

  key.x = pixelSize * 6;
  key.y = pixelSize * 7;

  key.block = false;
  key.canPickUp = true;

  [orc, dragon, door, key, player].forEach((item) =>
    gameArea.components.push(item)
  );
}
