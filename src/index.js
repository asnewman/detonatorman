import "./styles.css";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const CELL_SIZE = 50;
const GRID_SIZE_X = 18;
const GRID_SIZE_Y = 12;
const MAX_BOMBS = 3;
const BOMB_TIMER = 1000;

let player = {
  x: 0,
  y: 0,
  activeBombs: 0
};

let bombLocs = new Set();

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
  console.log(player);

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
    render();
  }, BOMB_TIMER);
};

const renderNewPlayer = (newPlayer) => {
  if (
    newPlayer.x >= GRID_SIZE_X ||
    newPlayer.y >= GRID_SIZE_Y ||
    newPlayer.x === -1 ||
    newPlayer.y === -1
  ) {
    return;
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
};

render();
