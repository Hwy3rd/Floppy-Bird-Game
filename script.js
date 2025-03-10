const startBtn = document.getElementById("start-btn");
const canvas = document.getElementById("canvas");
const startScreen = document.querySelector(".start-screen");
const endGameScreen = document.querySelector(".end-game-screen");
const pointsDisplay = document.getElementById("points");
const playAgainBtn = document.getElementById("play-again-btn");
const result = document.getElementById("result");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
const gravity = 0.08;
let points = 0;
let animationId;

const proportionalSize = (size) => {
  return innerHeight < 700 ? Math.ceil((size / 700) * innerHeight) : size;
}

class Player {
  constructor() {
    this.position = {
      x: 250,
      y: proportionalSize(280),
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 45;
    this.height = 45;
    this.status = "ALIVE";
  }
  draw() {
    ctx.fillStyle = "#99c9ff";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      if (this.position.y < 0) {
        this.position.y = 0;
        this.velocity.y = gravity;
      }
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }

    if (this.position.x < this.width) {
      this.position.x = this.width;
    }

    if (this.position.x >= canvas.width - this.width * 2) {
      this.position.x = canvas.width - this.width * 2;
    }
  }
}

class Platform {
  constructor(x, height) {
    this.position = {
      x,
      y: 0,
    };
    this.height = proportionalSize(height);
    this.width = 100;
    this.gap = 250;
  }
  draw() {
    ctx.fillStyle = "#acd157";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillRect(this.position.x, this.position.y + this.height + this.gap, this.width, innerHeight - this.gap - this.height);
  }
}

let player = new Player();

let platforms = [];

const createNewPlatform = () => {
    const x = canvas.width;
    const min = 50;
    const max = 350;
    const h = Math.floor(Math.random()*max) + min;
    const platform = new Platform(x, h);
    platforms.push(platform);
}

const animate = () => {
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    platforms.forEach((platform) => {
        platform.draw();
    });

    player.update();

    platforms.forEach((platform, index) => {
        platform.position.x -= 4;

        if(platform.position.x === canvas.width - 500) {
            createNewPlatform();
        }
        if(platform.position.x + platform.width <= player.position.x && 
            platform.position.x + platform.width + 4 > player.position.x) {
            points++;
            pointsDisplay.textContent = points;
        }
        if(platform.position.x + platform.width < -100) {
            platforms.splice(index, 1);
        }
    })

    checkPlatformCollusion();

    if(player.status === "DEAD") {
      endGame();
    }
};

const checkPlatformCollusion = () => {
  platforms.forEach((platform) => {
    const platformTop = platform.position.y + platform.height;
    const platformBottom = platform.position.y + platform.height + platform.gap;
    if (
      player.position.x + player.width > platform.position.x &&
      player.position.x < platform.position.x + platform.width
    ) {
      if (
        player.position.y < platformTop &&
        player.position.y + player.height > platformTop
      ) {
        player.status = "DEAD";
      }

      if (
        player.position.y + player.height > platformBottom &&
        player.position.y < platformBottom
      ) {
        player.status = "DEAD";
      }
    }

    if (player.position.y + player.height >= canvas.height) {
      player.status = "DEAD";
    }
  });
};

const movePlayer = (key, xVelocity) => {
  switch (key) {
    case "ArrowUp":
    case " ":
    case "Spacebar":
      player.velocity.y = xVelocity;
      break;
  }
};

const endGame = () => {
  cancelAnimationFrame(animationId)
  pointsDisplay.style.display = "none";
  endGameScreen.style.display = "block";
  result.textContent = points;
}

const startGame = () => {
  console.log(canvas.width + " x " + canvas.height)
  canvas.style.display = "block";
  startScreen.style.display = "none";
  pointsDisplay.style.display = "block";
  endGameScreen.style.display = "none";

  points = 0;
  pointsDisplay.textContent = points;
  player = new Player();
  platforms = [];
  createNewPlatform();
  animate();
};

playAgainBtn.addEventListener("click", startGame);
startBtn.addEventListener("click", startGame);

window.addEventListener("keydown", ({ key }) => {
  movePlayer(key, -4.5);
});

window.addEventListener("keyup", ({ key }) => {
  movePlayer(key, -2.5);
});
