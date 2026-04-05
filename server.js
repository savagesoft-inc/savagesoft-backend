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
    body { margin: 0; background: black; color: white; text-align: center; }
    canvas { background: #111; display: block; margin: auto; }
  </style>
</head>
<body>
<h1>Enemy Shooter</h1>
<canvas id="game" width="400" height="400"></canvas>

<script>
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let player = { x: 180, y: 350, size: 20 };
let enemy = { x: Math.random() * 380, y: 0, size: 20 };
let score = 0;

document.addEventListener("mousemove", (e) => {
  player.x = e.offsetX;
});

function draw() {
  ctx.clearRect(0, 0, 400, 400);

  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  ctx.fillStyle = "red";
  ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);

  enemy.y += 2;

  if (
    enemy.y + enemy.size > player.y &&
    enemy.x < player.x + player.size &&
    enemy.x + enemy.size > player.x
  ) {
    alert("Game Over! Score: " + score);
    location.reload();
  }

  if (enemy.y > 400) {
    enemy.y = 0;
    enemy.x = Math.random() * 380;
    score++;
  }

  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 10, 20);

  requestAnimationFrame(draw);
}

draw();
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
