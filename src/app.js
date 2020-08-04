let playerObject;
let orcObject;
let doorObject;
const pixelSize = 25;
const canvasWidth = pixelSize * 9 * 2;
const canvasHeight = pixelSize * 10 * 2;
const components = [];
const basicGreen = '#095709';

const playerStats = {
  name: 'Hero',
  icon: '🧍',
  color: basicGreen,
  x: 0,
  y: 0,
  hp: 20,
  attackMod: 3,
  damageMod: 0,
  defenceMod: 1,
};

const orcStats = {
  name: 'Orc',
  icon: '👹',
  color: basicGreen,
  x: pixelSize * 3,
  y: pixelSize * 3,
  hp: 15,
  attackMod: -1,
  damageMod: 1,
  defenceMod: 0,
};

const dragonStats = {
  name: 'Dragon',
  icon: '🐉',
  color: basicGreen,
  x: pixelSize * 8,
  y: pixelSize * 4,
  hp: 100,
  attackMod: 3,
  damageMod: 3,
  defenceMod: 3,
};

const door = {
  name: 'Door',
  icon: '🚪',
  color: 'black',
};

const key = {
  name: 'Key',
  icon: '🔑',
  color: 'black',
};

function startGame() {
  playerObject = new component(...Object.values(playerStats));
  orcObject = new component(...Object.values(orcStats));
  dragonObject = new component(...Object.values(dragonStats));
  doorObject = new component(
    ...Object.values(door),
    pixelSize * 5,
    pixelSize * 3
  );

  keyObject = new component(
    ...Object.values(key),
    pixelSize * 6,
    pixelSize * 7
  );

  components.push(orcObject);
  components.push(dragonObject);
  components.push(doorObject);
  components.push(keyObject);
  components.push(playerObject);

  gameArea.start();
}

const gameArea = {
  canvas: document.createElement('canvas'),
  start: function () {
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

function component(
  name,
  icon,
  color,
  x,
  y,
  hp,
  attackMod,
  damageMod,
  defenceMod
) {
  this.name = name;
  this.icon = icon;
  this.color = color;
  this.x = x;
  this.y = y;
  this.maxHp = hp;
  this.hp = hp;
  this.attackMod = attackMod;
  this.damageMod = damageMod;
  this.defenceMod = defenceMod;
  this.block = true;

  this.update = function () {
    ctx = gameArea.context;
    ctx.fillStyle = this.color;
    ctx.font = `${Math.floor(pixelSize * 0.75)}px Georgia`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillRect(this.x, this.y, pixelSize, pixelSize);
    ctx.fillText(this.icon, this.x + pixelSize / 2, this.y + pixelSize / 2);

    // HP text above component
    if (this.hp) {
      ctx.font = `${Math.floor(pixelSize * 0.6)}px Lucida Console`;
      ctx.fillStyle = 'black';
      ctx.fillText(
        `${this.hp}`,
        this.x + pixelSize / 2,
        Math.floor(this.y - pixelSize / 3)
      );
    }
  };

  this.attack = function (target) {
    if (!target || target.hp <= 0) return;

    // bumps to obstacle
    if (!target.hp) {
      log(`${this.name} <strong>bumps</strong> to ${target.name}<br>`);
      return;
    }

    // log(`${this.name} <strong>attacks</strong> ${target.name} 🡆 <br>`);

    const attackRoll = rollDice(20);
    const attack = attackRoll + this.attackMod;
    const defence = 10 + target.defenceMod;
    const isCrit = attackRoll === 20;
    const hitWord = isCrit ? 'Crit' : 'Hit';
    const hitColor = isCrit ? 'blue' : 'Green';
    const hitDice = isCrit ? 2 : 1;

    // misses
    if (!isCrit && attack < defence) {
      log(
        `<div style="color: grey">${this.name} <strong >Miss</strong> ${target.name} (${attack}/${defence}). ${target.name} HP: ${target.hp}/${target.maxHp}<br></div>`
      );
      return true;
    }

    const damageRoll = rollDice(6, hitDice);
    const damage = damageRoll + this.damageMod;

    // hits
    target.hp -= damage;
    log(
      `${this.name} <strong style="color: ${hitColor}">${hitWord} ${damage}</strong> ${target.name} (${attack}/${defence}). ${target.name} HP: ${target.hp}/${target.maxHp}<br>`
    );

    const targetHPLeftPercent = Math.floor((target.hp / target.maxHp) * 100);

    // change color if target is wounded
    if (targetHPLeftPercent <= 10) {
      target.color = '#570909';
    } else if (targetHPLeftPercent <= 25) {
      target.color = 'red';
    } else if (targetHPLeftPercent <= 50) {
      target.color = '#DF9922';
    } else if (targetHPLeftPercent <= 75) {
      target.color = '#D9DA65';
    }

    // target is dead
    if (target.hp <= 0) {
      target.color = 'grey';
      target.icon = '💀';
      target.block = false;
      target.hp = 0;

      log(`${target.name} is <strong style="color: red">dead</strong><br>`);
    }
    return true;
  };
}

function rollDice(side, dice) {
  return Array(dice || 1)
    .fill(Math.floor(Math.random() * side) + 1)
    .reduce((a, b) => a + b, 0);
}

function log(message) {
  document.getElementById('log').innerHTML =
    message + document.getElementById('log').innerHTML;
}

function updateGameArea() {
  gameArea.clear();
  components.forEach((comp) => comp.update());
}

function getCollision(x, y) {
  return components.filter((comp) => comp.x === x && comp.y === y)[0];
}

function moveUp() {
  const newY = playerObject.y - pixelSize;
  const obstacle = getCollision(playerObject.x, newY);

  battle(playerObject, obstacle);

  if (isOutsideCanvas(playerObject.x, newY) || (obstacle && obstacle.block))
    return;

  playerObject.y = newY;
}

function moveDown() {
  const newY = playerObject.y + pixelSize;
  const obstacle = getCollision(playerObject.x, newY);

  battle(playerObject, obstacle);

  if (isOutsideCanvas(playerObject.x, newY) || (obstacle && obstacle.block))
    return;

  playerObject.y = newY;
}

function moveLeft() {
  const newX = playerObject.x - pixelSize;
  const obstacle = getCollision(newX, playerObject.y);

  battle(playerObject, obstacle);

  if (isOutsideCanvas(newX, playerObject.y) || (obstacle && obstacle.block))
    return;

  playerObject.x = newX;
}

function moveRight() {
  const newX = playerObject.x + pixelSize;
  const obstacle = getCollision(newX, playerObject.y);

  battle(playerObject, obstacle);

  if (isOutsideCanvas(newX, playerObject.y) || (obstacle && obstacle.block))
    return;

  playerObject.x = newX;
}

function battle(ob1, ob2) {
  if (!ob1 || !ob2 || !ob1.hp || !ob2.hp) return;

  ob1.attack(ob2);
  if (ob2.hp > 0) ob2.attack(ob1);
  log('<br>');
}

function isOutsideCanvas(x, y) {
  return x < 0 || x >= canvasWidth || y < 0 || y >= canvasHeight;
}

function checkKey(e) {
  e = e || window.event;
  const moveMap = {
    '37': moveLeft,
    '38': moveUp,
    '39': moveRight,
    '40': moveDown,
  };

  const move = moveMap[e.keyCode];
  if (move && playerObject.hp > 0) move();
}

document.onkeydown = checkKey;
