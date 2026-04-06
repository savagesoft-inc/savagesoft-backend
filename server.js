const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

app.post("/generate", (req, res) => {
  const prompt = (req.body.prompt || "simple game").toLowerCase();

  let gameType = "clicker";

  if (
    includesAny(prompt, [
      "shooter", "shoot", "enemy", "battle", "fight", "combat",
      "attack", "gun", "blaster"
    ])
  ) {
    gameType = "shooter";
  } else if (
    includesAny(prompt, [
      "dodge", "dodging", "avoid", "evade", "survive",
      "survival", "don't get hit", "dont get hit",
      "avoid enemies", "avoid blocks", "obstacles"
    ])
  ) {
    gameType = "dodging";
  } else if (
    includesAny(prompt, [
      "catch", "catching", "collect", "grab", "pick up",
      "falling", "collect items", "gather"
    ])
  ) {
    gameType = "catching";
  } else if (
    includesAny(prompt, [
      "reaction", "reflex", "timing", "fast", "quick",
      "speed test", "click fast", "reaction time"
    ])
  ) {
    gameType = "reaction";
  } else if (
    includesAny(prompt, [
      "maze", "labyrinth", "escape", "find the exit",
      "puzzle maze", "maze game"
    ])
  ) {
    gameType = "maze";
  } else if (
    includesAny(prompt, [
      "click", "clicker", "tap", "tapping", "idle",
      "button", "simple game"
    ])
  ) {
    gameType = "clicker";
  }

  let gameCode = "";

  if (gameType === "shooter") {
    gameCode = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      background: black;
      color: white;
      text-align: center;
      font-family: Arial, sans-serif;
      overflow: hidden;
    }
    h1 {
      margin: 8px 0 4px;
      font-size: 24px;
      color: #00ffcc;
    }
    #status {
      font-size: 18px;
      margin-top: 8px;
      color: #00ffcc;
    }
    canvas {
      background: #111;
      display: block;
      margin: 10px auto;
      border: 2px solid #00ffcc;
    }
  </style>
</head>
<body>
<h1>Enemy Shooter</h1>
<div id="status">Score: 0</div>
<canvas id="game" width="400" height="320"></canvas>

<script>
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("status");

let player = { x: 190, y: 280, size: 20 };
let enemy = { x: Math.random() * 360, y: 20, size: 20 };
let score = 0;
let gameOver = false;

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  player.x = e.clientX - rect.left - player.size / 2;
  if (player.x < 0) player.x = 0;
  if (player.x > canvas.width - player.size) player.x = canvas.width - player.size;
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ffcc";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  ctx.fillStyle = "red";
  ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);

  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

function update() {
  if (gameOver) return;

  enemy.y += 2.2;

  if (
    enemy.y + enemy.size > player.y &&
    enemy.x < player.x + player.size &&
    enemy.x + enemy.size > player.x
  ) {
    gameOver = true;
    statusEl.textContent = "Game Over! Final Score: " + score;
    draw();
    return;
  }

  if (enemy.y > canvas.height) {
    enemy.y = 20;
    enemy.x = Math.random() * 360;
    score++;
    statusEl.textContent = "Score: " + score;
  }

  draw();
  requestAnimationFrame(update);
}

draw();
update();
</script>
</body>
</html>
`;
  } else if (gameType === "dodging") {
    gameCode = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      background: black;
      color: #00ffcc;
      text-align: center;
      font-family: Arial, sans-serif;
      overflow: hidden;
    }
    canvas {
      background: #111;
      display: block;
      margin: 10px auto;
      border: 2px solid #00ffcc;
    }
  </style>
</head>
<body>
<h1>Dodge Game</h1>
<div id="status">Survive!</div>
<canvas id="game" width="400" height="320"></canvas>

<script>
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("status");

let player = { x: 180, y: 280, w: 30, h: 30 };
let obstacles = [];
let frames = 0;
let gameOver = false;
let survival = 0;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") player.x -= 20;
  if (e.key === "ArrowRight") player.x += 20;
  if (player.x < 0) player.x = 0;
  if (player.x > canvas.width - player.w) player.x = canvas.width - player.w;
});

function spawnObstacle() {
  obstacles.push({
    x: Math.random() * 370,
    y: -20,
    w: 20,
    h: 20,
    speed: 2 + Math.random() * 2
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ffcc";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = "hotpink";
  for (const o of obstacles) {
    ctx.fillRect(o.x, o.y, o.w, o.h);
  }
}

function update() {
  if (gameOver) return;

  frames++;
  if (frames % 30 === 0) spawnObstacle();

  for (const o of obstacles) {
    o.y += o.speed;

    if (
      player.x < o.x + o.w &&
      player.x + player.w > o.x &&
      player.y < o.y + o.h &&
      player.y + player.h > o.y
    ) {
      gameOver = true;
      statusEl.textContent = "Game Over! Survived: " + survival + " sec";
      draw();
      return;
    }
  }

  obstacles = obstacles.filter((o) => o.y < canvas.height + 30);
  survival = Math.floor(frames / 60);
  statusEl.textContent = "Survival Time: " + survival + " sec";

  draw();
  requestAnimationFrame(update);
}

draw();
update();
</script>
</body>
</html>
`;
  } else if (gameType === "catching") {
    gameCode = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      background: black;
      color: #00ffcc;
      text-align: center;
      font-family: Arial, sans-serif;
      overflow: hidden;
    }
    canvas {
      background: #111;
      display: block;
      margin: 10px auto;
      border: 2px solid #00ffcc;
    }
  </style>
</head>
<body>
<h1>Catching Game</h1>
<div id="status">Score: 0</div>
<canvas id="game" width="400" height="320"></canvas>

<script>
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("status");

let basket = { x: 160, y: 285, w: 80, h: 20 };
let item = { x: Math.random() * 380, y: 0, size: 20, speed: 2.5 };
let score = 0;
let misses = 0;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") basket.x -= 25;
  if (e.key === "ArrowRight") basket.x += 25;
  if (basket.x < 0) basket.x = 0;
  if (basket.x > canvas.width - basket.w) basket.x = canvas.width - basket.w;
});

function resetItem() {
  item.x = Math.random() * 380;
  item.y = 0;
  item.speed = 2.5 + Math.random();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ffcc";
  ctx.fillRect(basket.x, basket.y, basket.w, basket.h);

  ctx.fillStyle = "yellow";
  ctx.fillRect(item.x, item.y, item.size, item.size);
}

function update() {
  item.y += item.speed;

  if (
    item.y + item.size >= basket.y &&
    item.x + item.size >= basket.x &&
    item.x <= basket.x + basket.w
  ) {
    score++;
    statusEl.textContent = "Score: " + score;
    resetItem();
  }

  if (item.y > canvas.height) {
    misses++;
    if (misses >= 3) {
      statusEl.textContent = "Game Over! Score: " + score;
      draw();
      return;
    }
    statusEl.textContent = "Score: " + score + " | Misses: " + misses + "/3";
    resetItem();
  }

  draw();
  requestAnimationFrame(update);
}

draw();
update();
</script>
</body>
</html>
`;
  } else if (gameType === "reaction") {
    gameCode = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      background: black;
      color: #00ffcc;
      text-align: center;
      font-family: Arial, sans-serif;
      padding-top: 30px;
    }
    #box {
      width: 160px;
      height: 160px;
      margin: 30px auto;
      background: gray;
      border: 2px solid #00ffcc;
      cursor: pointer;
    }
    button {
      background: #00ffcc;
      color: black;
      border: none;
      padding: 12px 20px;
      font-size: 16px;
      cursor: pointer;
      border-radius: 6px;
    }
  </style>
</head>
<body>
<h1>Reaction Game</h1>
<p>Wait for the box to turn green, then click it fast.</p>
<button onclick="startGame()">Start</button>
<div id="status">Press Start</div>
<div id="box"></div>

<script>
let startTime = 0;
let waiting = false;
let ready = false;
const box = document.getElementById("box");
const statusEl = document.getElementById("status");

function startGame() {
  box.style.background = "gray";
  statusEl.textContent = "Wait for green...";
  ready = false;
  waiting = true;

  const delay = 1000 + Math.random() * 3000;
  setTimeout(() => {
    box.style.background = "lime";
    statusEl.textContent = "CLICK!";
    startTime = Date.now();
    ready = true;
    waiting = false;
  }, delay);
}

box.onclick = () => {
  if (ready) {
    const reaction = Date.now() - startTime;
    statusEl.textContent = "Your reaction time: " + reaction + " ms";
    box.style.background = "#00ffcc";
    ready = false;
  } else if (waiting) {
    statusEl.textContent = "Too early! Try again.";
    box.style.background = "red";
    waiting = false;
  }
};
</script>
</body>
</html>
`;
  } else if (gameType === "maze") {
    gameCode = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      background: black;
      color: #00ffcc;
      text-align: center;
      font-family: Arial, sans-serif;
      overflow: hidden;
    }
    h1 {
      margin: 8px 0 4px;
      font-size: 24px;
    }
    #status {
      margin-bottom: 8px;
      font-size: 18px;
    }
    #board {
      position: relative;
      width: 400px;
      height: 300px;
      margin: 0 auto;
      background: #111;
      border: 2px solid #00ffcc;
      overflow: hidden;
    }
    .wall {
      position: absolute;
      background: hotpink;
    }
    #player {
      position: absolute;
      width: 20px;
      height: 20px;
      background: #00ffcc;
      left: 10px;
      top: 10px;
    }
    #goal {
      position: absolute;
      width: 20px;
      height: 20px;
      background: yellow;
      left: 370px;
      top: 260px;
    }
  </style>
</head>
<body>
<h1>Maze Game</h1>
<div id="status">Use arrow keys to reach the yellow square</div>

<div id="board">
  <div id="player"></div>
  <div id="goal"></div>

  <div class="wall" style="left:70px; top:0px; width:20px; height:220px;"></div>
  <div class="wall" style="left:140px; top:80px; width:20px; height:220px;"></div>
  <div class="wall" style="left:210px; top:0px; width:20px; height:220px;"></div>
  <div class="wall" style="left:280px; top:80px; width:20px; height:220px;"></div>
  <div class="wall" style="left:350px; top:0px; width:20px; height:180px;"></div>
</div>

<script>
const player = document.getElementById("player");
const goal = document.getElementById("goal");
const board = document.getElementById("board");
const statusEl = document.getElementById("status");
const walls = document.querySelectorAll(".wall");

let x = 10;
let y = 10;
const size = 20;
let won = false;

function isCollidingRect(ax, ay, aw, ah, bx, by, bw, bh) {
  return !(
    ax + aw <= bx ||
    ax >= bx + bw ||
    ay + ah <= by ||
    ay >= by + bh
  );
}

document.addEventListener("keydown", (e) => {
  if (won) return;

  let nx = x;
  let ny = y;

  if (e.key === "ArrowLeft") nx -= 10;
  if (e.key === "ArrowRight") nx += 10;
  if (e.key === "ArrowUp") ny -= 10;
  if (e.key === "ArrowDown") ny += 10;

  if (nx < 0 || ny < 0 || nx > board.clientWidth - size || ny > board.clientHeight - size) {
    return;
  }

  for (const wall of walls) {
    const wx = wall.offsetLeft;
    const wy = wall.offsetTop;
    const ww = wall.offsetWidth;
    const wh = wall.offsetHeight;

    if (isCollidingRect(nx, ny, size, size, wx, wy, ww, wh)) {
      return;
    }
  }

  x = nx;
  y = ny;
  player.style.left = x + "px";
  player.style.top = y + "px";

  const gx = goal.offsetLeft;
  const gy = goal.offsetTop;
  const gw = goal.offsetWidth;
  const gh = goal.offsetHeight;

  if (isCollidingRect(x, y, size, size, gx, gy, gw, gh)) {
    won = true;
    statusEl.textContent = "You escaped the maze!";
  }
});
</script>
</body>
</html>
`;
  } else {
    gameCode = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      background: black;
      color: #00ffcc;
      font-family: Arial, sans-serif;
      text-align: center;
      padding-top: 30px;
    }
    button {
      background: #00ffcc;
      color: black;
      border: none;
      padding: 12px 20px;
      font-size: 16px;
      cursor: pointer;
      border-radius: 6px;
    }
  </style>
</head>
<body>
<h1>Clicker Game</h1>
<p>Click the button to increase score!</p>
<button onclick="increaseScore()">Click me</button>
<h2 id="score">Score: 0</h2>

<script>
let score = 0;
function increaseScore() {
  score++;
  document.getElementById("score").innerText = "Score: " + score;
}
</script>
</body>
</html>
`;
  }

  res.json({ code: gameCode, detectedType: gameType });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Savagesoft.ai running on port " + PORT);
});
