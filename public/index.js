console.log("loading game");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const CELL_SIZE = 50;
const GRID_SIZE_X = 18;
const GRID_SIZE_Y = 12;
const MAX_BOMBS = 2;
const BOMB_TIMER = 1500;
const EXPLOSION_TIMER = 500;

let player = {
  x: 0,
  y: 0,
  activeBombs: 0,
};

let bombLocs = new Set();
let explosionLocs = new Set();

window.addEventListener("keydown", (e) => {
  const { x, y } = player;
  let newPlayer = { ...player };
  switch (e.key) {
    case "a":
      newPlayer = { ...player, x: x - 1, y };
      renderNewPlayer(newPlayer);
      break;
    case "w":
      newPlayer = { ...player, x, y: y - 1 };
      renderNewPlayer(newPlayer);
      break;
    case "d":
      newPlayer = { ...player, x: x + 1, y };
      renderNewPlayer(newPlayer);
      break;
    case "s":
      newPlayer = { ...player, x, y: y + 1 };
      renderNewPlayer(newPlayer);
      break;
    case ".":
      dropBomb();
      break;
    default:
      break;
  }
});

const dropBomb = () => {
  if (player.activeBombs >= MAX_BOMBS) {
    return;
  }

  const newBomb = { x: player.x, y: player.y };

  bombLocs.add(newBomb);
  player = { ...player, activeBombs: player.activeBombs + 1 };
  render();

  setTimeout(() => {
    bombLocs.delete(newBomb);
    player = { ...player, activeBombs: player.activeBombs - 1 };

    const newExplosions = [];
    newExplosions.push({ x: newBomb.x, y: newBomb.y });
    newExplosions.push({ x: newBomb.x, y: newBomb.y + 1 });
    newExplosions.push({ x: newBomb.x, y: newBomb.y + 2 });
    newExplosions.push({ x: newBomb.x, y: newBomb.y - 1 });
    newExplosions.push({ x: newBomb.x, y: newBomb.y - 2 });
    newExplosions.push({ x: newBomb.x + 1, y: newBomb.y });
    newExplosions.push({ x: newBomb.x + 2, y: newBomb.y });
    newExplosions.push({ x: newBomb.x - 1, y: newBomb.y });
    newExplosions.push({ x: newBomb.x - 2, y: newBomb.y });
    newExplosions.forEach((newExplosion) => explosionLocs.add(newExplosion));

    if (hasTouchedExplosion(player)) {
      console.log("player has died");
    }

    render();

    setTimeout(() => {
      newExplosions.forEach((newExplosion) =>
        explosionLocs.delete(newExplosion)
      );
      render();
    }, EXPLOSION_TIMER);
  }, BOMB_TIMER);
};

const hasCollision = (targetPlayer) => {
  return (
    targetPlayer.x >= GRID_SIZE_X ||
    targetPlayer.y >= GRID_SIZE_Y ||
    targetPlayer.x === -1 ||
    targetPlayer.y === -1 ||
    setHas(bombLocs, { x: targetPlayer.x, y: targetPlayer.y })
  );
};

const hasTouchedExplosion = (targetPlayer) => {
  return setHas(explosionLocs, { x: targetPlayer.x, y: targetPlayer.y });
};

/**
 * Horrible
 */
const setHas = (s, value) => {
  let has = false;
  s.forEach((e) => {
    if (JSON.stringify(e) === JSON.stringify(value)) {
      has = true;
    }
  });

  return has;
};

const renderNewPlayer = (newPlayer) => {
  if (hasCollision(newPlayer)) return;
  if (hasTouchedExplosion(newPlayer)) {
    console.log("player has died");
  }

  player = { ...newPlayer };
  render();
};

const render = () => {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, GRID_SIZE_X * CELL_SIZE, GRID_SIZE_Y * CELL_SIZE);
  ctx.fillStyle = "green";
  ctx.fillRect(player.x * CELL_SIZE, player.y * CELL_SIZE, 50, 50);

  bombLocs.forEach((bomb) => {
    ctx.fillStyle = "black";
    ctx.fillRect(bomb.x * CELL_SIZE, bomb.y * CELL_SIZE, 50, 50);
  });

  explosionLocs.forEach((explosion) => {
    ctx.fillStyle = "red";
    ctx.fillRect(explosion.x * CELL_SIZE, explosion.y * CELL_SIZE, 50, 50);
  });
};

render();
