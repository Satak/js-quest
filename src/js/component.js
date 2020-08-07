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

class Ring extends Component {
  constructor(name, icon, color, attackMod, damageMod, defenceMod, maxHPMod) {
    super(name, icon, color);
    this.attackMod = attackMod;
    this.damageMod = damageMod;
    this.defenceMod = defenceMod;
    this.maxHPMod = maxHPMod;
  }
}

class HealthPotion extends Component {
  constructor(name, icon, color, heal) {
    super(name, icon, color);
    this.heal = heal;
    this.block = false;
    this.canPickUp = true;
  }
}

class Weapon extends Component {
  constructor(name, icon, color, attackMod, damageMod, defenceMod, attackDice) {
    super(name, icon, color);
    this.attackMod = attackMod;
    this.damageMod = damageMod;
    this.defenceMod = defenceMod;
    this.attackDice = attackDice || 1;
    this.block = false;
    this.canPickUp = true;
  }
}

class Armor extends Component {
  constructor(name, icon, color, attackMod, damageMod, defenceMod) {
    super(name, icon, color);
    this.attackMod = attackMod;
    this.damageMod = damageMod;
    this.defenceMod = defenceMod;
    this.block = false;
    this.canPickUp = true;
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
    this.ring = null;
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

    target.updateColor();

    // target is dead
    if (target.hp <= 0) {
      this.xp += target.xp;
      this.gold += target.gold;
      target.inventory.forEach((item, index) => {
        item.x = target.x + pixelSize * index;
        item.y = target.y;
        item.canPickUp = true;
        item.block = false;
        gameArea.components.unshift(item);
      });

      gameArea.components.splice(gameArea.components.indexOf(target), 1);

      log(`${target.name} is <strong style="color: red">dead</strong><br>`);
    }

    return true;
  }

  updateColor() {
    const hpLeftPercent = Math.floor((this.hp / this.maxHp) * 100);

    // change color if wounded
    if (hpLeftPercent <= 10) {
      this.color = '#570909';
    } else if (hpLeftPercent <= 25) {
      this.color = 'red';
    } else if (hpLeftPercent <= 50) {
      this.color = '#DF9922';
    } else if (hpLeftPercent <= 75) {
      this.color = '#D9DA65';
    } else if (this.color !== basicGreen) {
      this.color = basicGreen;
    }
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

    if (item && item.canPickUp) {
      log(`${this.name} picked up a ${item.name} ${item.icon}<br>`);
      this.inventory.unshift(item);
      gameArea.components.splice(gameArea.components.indexOf(item), 1);
    }
  }

  showInventory() {
    this.inventory.forEach((item) => {
      log(`Inv: ${item.name} ${item.icon}<br>`);
      console.table(item);
    });
  }

  heal() {
    this.inventory.forEach((item) => {
      if (item instanceof HealthPotion) {
        log(
          `${this.name} drink ${item.name} ${item.icon} (+${item.heal} HP)<br>`
        );
        this.hp += item.heal;
        this.updateColor();
      }
    });
  }
}
