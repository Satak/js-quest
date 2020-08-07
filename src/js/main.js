const player = new Player(...Object.values(playerStats));
const gameArea = new GameArea('gameArea', canvasWidth, canvasHeight, frameRate);

function startGame() {
  const orc = new Character(...Object.values(orcStats));
  const dragon = new Character(...Object.values(dragonStats));
  const door = new Component(...Object.values(doorStats));
  const key = new Component(...Object.values(keyStats));
  const ring = new Ring(...Object.values(ringStats));
  const potion = new HealthPotion(...Object.values(hpPotion));
  const sword = new Weapon(...Object.values(swordStats));
  const shield = new Armor(...Object.values(shieldStats));

  dragon.gold = 100;
  dragon.xp = 50;

  orc.inventory = [ring, key, potion];
  orc.xp = 10;
  orc.gold = 5;

  door.x = pixelSize * 5;
  door.y = pixelSize * 3;

  sword.x = pixelSize * 1;
  sword.y = pixelSize * 2;

  shield.x = pixelSize * 1;
  shield.y = pixelSize * 3;

  gameArea.components = [orc, dragon, door, sword, shield, player];
}
