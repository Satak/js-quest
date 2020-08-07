function rollDice(side, dice) {
  return Array(dice || 1)
    .fill(Math.floor(Math.random() * side) + 1)
    .reduce((a, b) => a + b, 0);
}

function log(message) {
  document.getElementById('log').innerHTML =
    message + document.getElementById('log').innerHTML;
}

function battle(ob1, ob2) {
  if (!ob1 || !ob2 || !ob1.hp || !ob2.hp) return;

  ob1.attack(ob2);
  if (ob2.hp > 0) ob2.attack(ob1);
  log('<br>');
}
