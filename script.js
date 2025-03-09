const startBtn = document.getElementById("start-btn");
const canvas = document.getElementById("canvas");
const startScreen = document.querySelector(".start-screen");
const pointsDisplay = document.getElementById("points");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
const gravity = 0.08;
let points = 0;

class Player {
  constructor() {
    this.position = {
      x: 250,
      y: 280,
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
    this.height = height;
    this.width = 100;
    this.gap = 250;
  }
  draw() {
    ctx.fillStyle = "#acd157";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillRect(this.position.x, this.position.y + this.height + this.gap, this.width, innerHeight - this.gap - this.height);
  }
}

const player = new Player();

const platforms = [];

const createNewPlatform = () => {
    const x = canvas.width;
    const min = 50;
    const max = 350;
    const h = Math.floor(Math.random()*max) + min;
    const platform = new Platform(x, h);
    platforms.push(platform);
}

createNewPlatform();

const animate = () => {
    requestAnimationFrame(animate);
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
            console.log("counted!");
        }
        if(platform.position.x + platform.width < -100) {
            platforms.splice(index, 1);
        }
    })
    
    if(player.status === "DEAD") {
        return;
    }
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

const startGame = () => {
  console.log(canvas.width + " x " + canvas.height)
  canvas.style.display = "block";
  startScreen.style.display = "none";
  points = 0;
  pointsDisplay.style.display = "block";
  animate();
};

startBtn.addEventListener("click", startGame);

window.addEventListener("keydown", ({ key }) => {
  movePlayer(key, -4.5);
});

window.addEventListener("keyup", ({ key }) => {
  movePlayer(key, -2.5);
});
