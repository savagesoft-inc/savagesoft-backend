const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", (req, res) => {
  const prompt = (req.body.prompt || "simple game").toLowerCase();

  let gameCode = "";

  if (
    prompt.includes("enemy") ||
    prompt.includes("shooter") ||
    prompt.includes("battle")
  ) {
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
    canvas {
      background: #111;
      display: block;
      margin: 10px auto;
      border: 2px solid #00ffcc;
    }
    #status {
      font-size: 18px;
      margin-top: 8px;
      color: #00ffcc;
    }
    h1 {
      margin: 8px 0 4px;
      font-size: 24px;
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
  if (player.x > canvas.width - player.size) {
    player.x = canvas.width - player.size;
  }
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

  enemy.y += 2;

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
      padding-top: 20px;
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
<h1>Simple Game</h1>
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

  res.json({ code: gameCode });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Savagesoft.ai running on port " + PORT);
});
