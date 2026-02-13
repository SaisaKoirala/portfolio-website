const canvas = document.querySelector("#mazeCanvas");
const statusEl = document.querySelector("#mazeStatus");
const resetBtn = document.querySelector("#resetBtn");
const subtitleEl = document.querySelector("#mazeSubtitle");
const controlButtons = document.querySelectorAll(".control-btn");

const ctx = canvas.getContext("2d");

const maze = [
  "111111111111111",
  "100000001000001",
  "101111101011101",
  "101000101010001",
  "101110101011101",
  "100010100000001",
  "111010111110101",
  "100010000010101",
  "101111111010101",
  "101000001010001",
  "101011101011101",
  "100010001000001",
  "101110111111101",
  "100000000000001",
  "111111111111111",
];

const cellSize = 32;
const rows = maze.length;
const cols = maze[0].length;

canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

const start = { x: 1, y: 1 };
const goal = { x: cols - 2, y: rows - 2 };
let player = { ...start };
let finished = false;

const drawMaze = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (maze[y][x] === "1") {
        ctx.fillStyle = "#1f2937";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  ctx.fillStyle = "#2a9d8f";
  ctx.fillRect(start.x * cellSize + 6, start.y * cellSize + 6, cellSize - 12, cellSize - 12);

  ctx.fillStyle = "#f4a261";
  ctx.fillRect(goal.x * cellSize + 6, goal.y * cellSize + 6, cellSize - 12, cellSize - 12);

  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.arc(
    player.x * cellSize + cellSize / 2,
    player.y * cellSize + cellSize / 2,
    cellSize / 3,
    0,
    Math.PI * 2
  );
  ctx.fill();
};

const canMoveTo = (x, y) => maze[y] && maze[y][x] === "0";

const movePlayer = (dx, dy) => {
  if (finished) return;

  const nextX = player.x + dx;
  const nextY = player.y + dy;

  if (canMoveTo(nextX, nextY)) {
    player = { x: nextX, y: nextY };
    drawMaze();
    checkWin();
  }
};

const checkWin = () => {
  if (player.x === goal.x && player.y === goal.y) {
    finished = true;
    statusEl.textContent = "Nice. Returning to search...";
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1800);
  }
};

const resetMaze = () => {
  player = { ...start };
  finished = false;
  statusEl.textContent = "";
  drawMaze();
};

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
    movePlayer(0, -1);
  }
  if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
    movePlayer(0, 1);
  }
  if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
    movePlayer(-1, 0);
  }
  if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
    movePlayer(1, 0);
  }
});

if (resetBtn) {
  resetBtn.addEventListener("click", resetMaze);
}

const moveMap = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

controlButtons.forEach((button) => {
  const direction = button.dataset.move;
  const move = moveMap[direction];
  if (!move) return;

  const handlePress = (event) => {
    event.preventDefault();
    movePlayer(move[0], move[1]);
  };

  button.addEventListener("click", handlePress);
  button.addEventListener("touchstart", handlePress, { passive: false });
});

const setSubtitle = () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");
  if (query && subtitleEl) {
    subtitleEl.textContent = `You searched for "${query}". Solve the maze to get back.`;
  }
};

setSubtitle();
resetMaze();
