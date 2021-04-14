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
// const mouse = {
//   x: 0,
//   y: 0
// };

// const timesPerSecond = 50;
// let wait = false;
// canvas.addEventListener("mousemove", (e) => {
  
//   if (!wait) {
//     mouse.x = e.clientX;
//     mouse.y = e.clientY;
//     for (let i = 0; i < 1; i++) {
//       mouseBubbles.push(new Particle(mouse.x, mouse.y));
//       wait = true;
//       setTimeout(function () {
//         wait = false;
//       }, 300 / timesPerSecond);
//     }
//   }
// });
// canvas.addEventListener("mousemove", (e) => {
//   mouse.x = e.clientX;
//   mouse.y = e.clientY;
//   for (let i = 0; i < 1; i++) {
//     mouseBubbles.push(new Particle(mouse.x, mouse.y));
//     wait = true;
//     setTimeout(function () {
//       wait = false;
//     }, 300 / timesPerSecond);
//   }
// });

const bubbleInterval = 2000;
function bubbleBot() {
  if(document.hidden) {
    return
  }
  this.x = randomIntFromRange(0, wX);
  // this.x = wX/2;
  particleArray.push(new Particle(this.x, wY + 10));
}
setInterval(bubbleBot, bubbleInterval);

// Random Util Function
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Define Particles
let particleArray = [];
let mouseBubbles = [];

const sprite = new Image();
sprite.src = 'blob.svg';

function rotateAndPaintImage ( context, image, angleInRad , positionX, positionY, axisX, axisY, size ) {
  context.translate( positionX, positionY );
  context.rotate( angleInRad );
  context.drawImage( image, -axisX, -axisY, size, size );
  context.rotate( -angleInRad );
  context.translate( -positionX, -positionY );
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = randomIntFromRange(10, 20);
    // this.speedX = randomIntFromRange(-.5, .5);
    this.speedX1 = 0;
    this.speedXVar = randomIntFromRange(-2, 2);
    this.speedX2 = this.speedXVar >= 0 ? 0.05 : -0.05;
    this.speedY = randomIntFromRange(-1, -4);
    this.rotation = randomIntFromRange(0, 360);
    this.rotationSpeed = this.speedX1 < 0 ? -0.02 : 0.02;
    this.opacity = 1;
  }

  draw() {
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    // ctx.fillStyle = this.color;
    // ctx.lineWidth = 2;
    // ctx.fill(p1);
    // ctx.closePath();
    // ctx.drawImage(sprite, this.x, this.y, this.r, this.r);
    ctx.globalAlpha = this.opacity;
    rotateAndPaintImage(ctx, sprite, this.rotation, this.x, this.y, this.r, this.r, this.r)
    if (this.y < 100) {
      this.opacity -= .05;
    }
  }

  update() {
    this.x += this.speedX1;
    this.speedX1 += this.speedX2;
    if(this.speedX1 <= -1.5 || this.speedX1 >= 1.5) {
      this.speedX2 = -this.speedX2;
    }
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;
  }

  fade() {
    this.opacity -= 0.025;
  }
}

// Loop through particles to animate
function handleParticles() {
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].update();
    particleArray[i].draw();

    if (particleArray[i].y < 0 - this.r || particleArray[i].opacity <= 0.1) {
      particleArray.splice(i, 1);
      i--;
    }
  }
}

function handleMouseBubbles() {
  for (let i = 0; i < mouseBubbles.length; i++) {
    mouseBubbles[i].update();
    mouseBubbles[i].fade();
    mouseBubbles[i].draw();

    if (mouseBubbles[i].y < 0 - this.r || mouseBubbles[i].opacity <= 0.1) {
      mouseBubbles.splice(i, 1);
      i--;
    }
  }
}

// Animate Particles
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleParticles();
  handleMouseBubbles();
  requestAnimationFrame(animate);
}

function release(){
  for(let z = 0; z < 10; z++) {
    bubbleBot();
  }
}
// release();
animate();

// Intersection Observer Setup
const obObjects = document.querySelectorAll(".observed");
const canvWrap = document.querySelector('.canvas-wrap');
const octopus = document.querySelector('.octopus');

const offsetTop = `-10%`;
const offsetBot = `-10%`;
const observerOptions = {
  rootMargin: `${offsetTop} 0px ${offsetBot} 0px`,
  threshold: [0]
};

// Intersection Observer Callback Function
function observerCallback(entries) {
  entries.forEach((entry) => {
    const el = entry.target;
    const color = el.dataset.color;
    if (el.classList.contains("scroll-text") && entry.isIntersecting && entry.boundingClientRect.y>0) {
      document.body.classList.add(color);
      el.classList.add('in-view');
      if (el.dataset.color==='blue-01') {
        canvWrap.classList.add('in-view');
      }
      if (el.dataset.color==='blue-03') {
        octopus.classList.add('in-view');
      }
    } else if (el.classList.contains("scroll-text") && entry.isIntersecting===false && entry.boundingClientRect.y>0) {
      document.body.classList.remove(color);
      el.classList.remove('in-view');
      if (el.dataset.color==='blue-01') {
        canvWrap.classList.remove('in-view');
      }
      if (el.classList.contains("octo-wrapper")) {
        octopus.classList.remove('in-view');
      }
    } 
  });
}

// Instancing a New Intersection Observer
const observer = new IntersectionObserver(observerCallback, observerOptions);
obObjects.forEach((obj) => {
  observer.observe(obj);
});

// visibility test
const handleChange = (e) => {
  document.title = document.hidden ? "Come back!" : "Bubbles!";
  document.hidden ? particleArray = [] : null;  
}
window.addEventListener('visibilitychange', handleChange)

const textWrappers = document.querySelectorAll('.scroll-text .highlight');
textWrappers.forEach(wrapper => {
  wrapper.innerHTML = wrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
})

