const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", (req, res) => {
  const prompt = (req.body.prompt || "Simple Game").toLowerCase();

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
            color: #00ffcc;
            font-family: Arial, sans-serif;
            text-align: center;
            overflow: hidden;
          }
          h2 { margin-top: 20px; }
          #score { font-size: 24px; margin: 10px 0; }
          #enemy {
            width: 50px;
            height: 50px;
            background: hotpink;
            border-radius: 50%;
            position: absolute;
            cursor: pointer;
            box-shadow: 0 0 20px hotpink;
          }
        </style>
      </head>
      <body>
        <h2>${prompt}</h2>
        <div id="score">Score: 0</div>
        <div id="enemy"></div>

        <script>
          let score = 0;
          const enemy = document.getElementById("enemy");
          const scoreEl = document.getElementById("score");

          function moveEnemy() {
            const maxX = window.innerWidth - 50;
            const maxY = window.innerHeight - 50;
            enemy.style.left = Math.random() * maxX + "px";
            enemy.style.top = (80 + Math.random() * (maxY - 80)) + "px";
          }

          enemy.addEventListener("click", () => {
            score++;
            scoreEl.textContent = "Score: " + score;
            moveEnemy();
          });

          moveEnemy();
          setInterval(moveEnemy, 1200);
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
            overflow: hidden;
          }
          h2 { margin-top: 20px; }
          #score { font-size: 24px; margin: 10px 0; }
          #target {
            width: 60px;
            height: 60px;
            background: #00ffcc;
            position: absolute;
            border-radius: 12px;
            cursor: pointer;
            box-shadow: 0 0 20px #00ffcc;
          }
        </style>
      </head>
      <body>
        <h2>${prompt}</h2>
        <div id="score">Score: 0</div>
        <div id="target"></div>

        <script>
          let score = 0;
          const target = document.getElementById("target");
          const scoreEl = document.getElementById("score");

          function moveTarget() {
            const maxX = window.innerWidth - 60;
            const maxY = window.innerHeight - 60;
            target.style.left = Math.random() * maxX + "px";
            target.style.top = (80 + Math.random() * (maxY - 80)) + "px";
          }

          target.addEventListener("click", () => {
            score++;
            scoreEl.textContent = "Score: " + score;
            moveTarget();
          });

          moveTarget();
        </script>
      </body>
      </html>
    `;
  }

  res.json({ code: gameCode });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Savagesoft backend running on port " + PORT);
});
