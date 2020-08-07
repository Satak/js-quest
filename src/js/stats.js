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
  x: pixelSize * 2,
  y: pixelSize * 1,
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

const doorStats = {
  name: 'Door',
  icon: '🚪',
  color: 'black',
};

const keyStats = {
  name: 'Key',
  icon: '🔑',
  color: 'black',
};

const swordStats = {
  name: 'Sword',
  icon: '🗡️',
  color: 'black',
  attackMod: 2,
  damageMod: 2,
  defenceMod: 2,
  attackDice: 2,
};

const shieldStats = {
  name: 'Shield',
  icon: '🛡️',
  color: 'black',
  attackMod: 0,
  damageMod: 0,
  defenceMod: 3,
};

const ringStats = {
  name: 'Mystic Ring',
  icon: '💍',
  color: 'black',
  attackMod: 2,
  damageMod: 5,
  defenceMod: 5,
  maxHPMod: 30,
};

const hpPotion = {
  name: 'Health Potion',
  icon: '🧪',
  color: 'black',
  heal: 10,
};
