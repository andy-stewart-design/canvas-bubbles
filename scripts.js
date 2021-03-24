// Canvas Setup
const canvas = document.querySelector("#canvas1");
const ctx = canvas.getContext("2d");
let wX, wY;
let hue = 0;

function setCanvas() {
  const scale = window.devicePixelRatio;
  wX = window.innerWidth;
  wY = window.innerHeight;
  canvas.style.width = wX + "px";
  canvas.style.height = wY + "px";
  canvas.width = wX * scale;
  canvas.height = wY * scale;
  ctx.scale(scale, scale);
}
setCanvas();

// Resize Canvas
window.addEventListener("resize", function () {
  setCanvas();
});

// Get/Set Mouse Coords
const mouse = {
  x: 0,
  y: 0
};

const timesPerSecond = 15;
let wait = false;
canvas.addEventListener("mousemove", (e) => {
  if (!wait) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    for (let i = 0; i < 1; i++) {
      particleArray.push(new Particle(mouse.x, mouse.y));
      wait = true;
      setTimeout(function () {
        wait = false;
      }, 1000 / timesPerSecond);
    }
  }
});

function bubbleBot() {
  this.y = randomIntFromRange(0, wX);
  particleArray.push(new Particle(this.y, wY + 25));
}
setInterval(bubbleBot, 300);

// Random Util Function
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Define Particles
const particleArray = [];

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = randomIntFromRange(10, 25);
    this.speedX = randomIntFromRange(-1, 1);
    this.speedY = randomIntFromRange(-1, -6);
    this.color = `hsla(32, 41%, 90%, .75)`;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.r > 0.2 ? (this.r -= 0.05) : null;
  }
}

// Loop through particles to animate
function handleParticles() {
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].update();
    particleArray[i].draw();

    if (particleArray[i].y < 0 - this.r) {
      particleArray.splice(i, 1);
      i--;
    }
  }
}

// Animate Particles
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleParticles();
  requestAnimationFrame(animate);
}

for(let z = 0; z < 25; z++) {
  bubbleBot();
}
animate();

// Intersection Observer Setup
const obObjects = document.querySelectorAll(".text-wrap");
const scrollText = document.querySelector('.scroll');

const offsetTop = `-45%`;
const offsetBot = `-45%`;
const observerOptions = {
  rootMargin: `${offsetTop} 0px ${offsetBot} 0px`,
  threshold: [0]
};

// Intersection Observer Callback Function
function observerCallback(entries) {
  entries.forEach((entry) => {
    console.log(entry.target.dataset.color);
    console.log(entry.isIntersecting);
    const color = entry.target.dataset.color;
    if (entry.isIntersecting) {
      document.body.classList.add(color);
      entry.target.classList.add('in-view');
      scrollText.classList.remove('in-view');
    } else {
      document.body.classList.remove(color);
      entry.target.classList.remove('in-view');
    }
  });
}

// Instancing a New Intersection Observer
const observer = new IntersectionObserver(observerCallback, observerOptions);
obObjects.forEach((obj) => {
  observer.observe(obj);
});
