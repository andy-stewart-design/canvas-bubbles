// Canvas Setup
const canvas = document.querySelector("#canvas");
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

// Util Function to get a random vakue from a range
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// create a new bubble that animates up from the bottom of the screen at an interval
const bubbleInterval = 2000;
function bubbleBot() {
  if(document.hidden) {
    return
  }
  this.x = randomIntFromRange(0, wX);
  bubbleArray.push(new Bubble(this.x, wY + 10));
}
setInterval(bubbleBot, bubbleInterval);

// Define bubble array
let bubbleArray = [];

// define image to use in each bubble
const sprite = new Image();
sprite.src = 'blob.svg';

// rotate the bubb
function rotateAndPaintImage ( context, image, angleInRad, positionX, positionY, axisX, axisY, size ) {
  context.translate( positionX, positionY );
  context.rotate( angleInRad );
  context.drawImage( image, -axisX, -axisY, size, size );
  context.rotate( -angleInRad );
  context.translate( -positionX, -positionY );
}

// define bubble class
class Bubble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = randomIntFromRange(10, 20);
    this.speedX1 = 0;
    this.speedXVar = randomIntFromRange(-2, 2);
    this.speedX2 = this.speedXVar >= 0 ? 0.05 : -0.05;
    this.speedY = randomIntFromRange(-1, -4);
    this.rotation = randomIntFromRange(0, 360);
    this.rotationSpeed = this.speedX1 < 0 ? -0.02 : 0.02;
    this.opacity = 1;
  }
  draw() {
    ctx.globalAlpha = this.opacity;
    rotateAndPaintImage(ctx, sprite, this.rotation, this.x, this.y, this.r, this.r, this.r)
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

// Loop through bubbles to animate
function handleBubbles() {
  for (let i = 0; i < bubbleArray.length; i++) {
    bubbleArray[i].update();
    bubbleArray[i].draw();
    // if the bubble is above the top of the screen or if it is invisible, remove it from the array
    if (bubbleArray[i].y < 0 - this.r || bubbleArray[i].opacity <= 0.1) {
      bubbleArray.splice(i, 1);
      i--;
    }
  }
}

// Animate Bubbles
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleBubbles();
  requestAnimationFrame(animate);
}
animate();

// stop animation when browser tab is inactive
const handleChange = (e) => {
  document.hidden ? bubbleArray = [] : null;  
}
window.addEventListener('visibilitychange', handleChange)

// Intersection Observer Setup
const obObjects = document.querySelectorAll(".observed");
const canvWrap = document.querySelector('.bg-wrap');
const canvWrap2 = document.querySelector('.canvas-wrap');
const octopus = document.querySelector('.octopus');
const fish = document.querySelector('#scrolly-fish');
const gradient = document.querySelector('.seaweed-gradient');

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
        canvWrap2.classList.add('in-view');
      }
      if (el.dataset.color==='blue-02') {
        fish.classList.add('in-view');
      }
      if (el.dataset.color==='blue-03') {
        octopus.classList.add('in-view');
        gradient.classList.add('in-view');
      }
    } else if (el.classList.contains("scroll-text") && entry.isIntersecting===false && entry.boundingClientRect.y>0) {
      document.body.classList.remove(color);
      el.classList.remove('in-view');
      if (el.dataset.color==='blue-01') {
        canvWrap.classList.remove('in-view');
        canvWrap2.classList.remove('in-view');
      }
      if (el.dataset.color==='blue-02') {
        fish.classList.remove('in-view');
      }
      if (el.dataset.color==='blue-03') {
        octopus.classList.remove('in-view');
        gradient.classList.remove('in-view')
      }
    } 
  });
}

// Instancing a New Intersection Observer
const observer = new IntersectionObserver(observerCallback, observerOptions);
obObjects.forEach((obj) => {
  observer.observe(obj);
});

// split text of the highlighted text
const textWrappers = document.querySelectorAll('.scroll-text .highlight');
textWrappers.forEach(wrapper => {
  wrapper.innerHTML = wrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
})