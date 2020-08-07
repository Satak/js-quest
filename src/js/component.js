class Component {
  constructor(name, icon, color, x, y) {
    this.name = name;
    this.icon = icon;
    this.color = color;
    this.x = x;
    this.y = y;
    this.block = true;
    this.canPickUp = false;
  }

  update() {
    const ctx = gameArea.context;
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
  }
}

class Character extends Component {
  constructor(name, icon, color, x, y, hp, attackMod, damageMod, defenceMod) {
    super(name, icon, color, x, y);

    this.maxHp = hp;
    this.hp = hp;
    this.attackMod = attackMod;
    this.damageMod = damageMod;
    this.defenceMod = defenceMod;
    this.inventory = [];
    this.weapon = null;
    this.armor = null;
    this.gold = 0;
    this.xp = 0;
  }

  attack(target) {
    if (!target || target.hp <= 0) return;

    const attackRoll = rollDice(20);
    const attack = attackRoll + this.attackMod;
    const defence = 10 + target.defenceMod;
    const isCrit = attackRoll === 20;
    const hitWord = isCrit ? 'Crit' : 'Hit';
    const hitColor = isCrit ? 'blue' : 'Green';
    const hitDice = isCrit ? 2 : 1;
    const damageRoll = rollDice(6, hitDice);
    const damage = damageRoll + this.damageMod;
    let targetHPLeftPercent;

    // bumps to obstacle
    if (!target.hp) {
      log(`${this.name} <strong>bumps</strong> to ${target.name}<br>`);
      return;
    }

    // misses
    if (!isCrit && attack < defence) {
      log(
        `<div style="color: grey">${this.name} <strong >Miss</strong> ${target.name} (${attack}/${defence}). ${target.name} HP: ${target.hp}/${target.maxHp}<br></div>`
      );
      return true;
    }

    // hits
    target.hp -= damage;
    log(
      `${this.name} <strong style="color: ${hitColor}">${hitWord} ${damage}</strong> ${target.name} (${attack}/${defence}). ${target.name} HP: ${target.hp}/${target.maxHp}<br>`
    );

    targetHPLeftPercent = Math.floor((target.hp / target.maxHp) * 100);

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
  }

  move(x, y) {
    const newX = this.x + x;
    const newY = this.y + y;
    const obstacle = this.getCollision(newX, newY);

    battle(this, obstacle);

    if (this.isOutsideCanvas(newX, newY) || (obstacle && obstacle.block))
      return;

    this.x = newX;
    this.y = newY;
  }

  getCollision(x, y) {
    return gameArea.components.filter(
      (comp) => comp.x === x && comp.y === y && comp !== this
    )[0];
  }

  isOutsideCanvas(x, y) {
    return x < 0 || x >= canvasWidth || y < 0 || y >= canvasHeight;
  }
}

class Player extends Character {
  constructor(name, icon, color, x, y, hp, attackMod, damageMod, defenceMod) {
    super(name, icon, color, x, y, hp, attackMod, damageMod, defenceMod);
  }

  pickUp() {
    const item = this.getCollision(this.x, this.y);

    if (item) {
      alert(`You picked up ${item.name}`);
      this.inventory.push(item);
      gameArea.components.splice(gameArea.components.indexOf(item), 1);
    }
  }

  showInventory() {
    console.table(this.inventory);
  }
}
