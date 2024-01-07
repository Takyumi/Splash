import './tailwind.css'
import Two from 'https://cdn.skypack.dev/two.js@latest';

const timelineContainer = document.querySelector('#timelineContainer');
timelineContainer.innerHTML = '';

let width = timelineContainer.offsetWidth;
let height = window.innerHeight/5; // Hardcoded, change based on index.html

let tickSize = 10;
let spcBtwn = 50;
let numTick = width/spcBtwn;
let ticksDrawn = 0;

let xPrev = 0, yPrev = 0;
let delta = 0;

let leftTick = 0, rightTick = 0;
let dleft = 0, dright = 0;

let mouseDrag = false;

let two;

document.addEventListener('DOMContentLoaded', () => {

  two = new Two({
    type: Two.Types.svg,
    width: width,
    height: height
  }).appendTo(timelineContainer);

  resize();

  two.bind('update', draw);
  two.play();

  document.addEventListener('mousedown', mousePressed);
  document.addEventListener('mouseup', mouseReleased);
  document.addEventListener('mousemove', mouseMoved);

});

function resize() {
  width = timelineContainer.offsetWidth;
  height = window.innerHeight/5; // Hardcoded, change based on index.html

  two.width = width;
  two.height = height;

  numTick = width/spcBtwn;
}

function draw() {
  two.clear();
  resize();

  let mainLine = two.makeLine(0, height / 2, width, height / 2);
  mainLine.stroke = 'black';
  mainLine.linewidth = 3;
  
  while (dleft < 0) {
    dleft += spcBtwn; // visible, not negative
  }
  while (dright < 0) {
    dright += spcBtwn; // visible not negative
  }

  // add circles for debugging if needed
  
  ticksDrawn = 0;

  while (dright >= spcBtwn) {
    dright -= spcBtwn;
    drawTick(width - dright);
    ticksDrawn += 1;
  }

  for(let i = ticksDrawn; i <= numTick; i++) {
    drawTick(width - dright - (i * spcBtwn));
  }

}

function drawTick(x) {
  let makeTick = two.makeLine(x, height/2 + tickSize, x, height/2 - tickSize);
  makeTick.stroke = 'black';
  makeTick.linewidth = 3;
}

function mousePressed(event) {
  if (event.clientY > window.innerHeight - height) {
    xPrev = event.clientX;
    yPrev = event.clientY;

    mouseDrag = true;
  }
}

function mouseReleased(event) {
  if (mouseDrag) {
    leftTick = (delta + leftTick) % spcBtwn;
    while (leftTick < 0) {
      leftTick += spcBtwn;
    }
    
    rightTick = leftTick + spcBtwn * (numTick - 1); 

    dleft = leftTick;
    dright = width - rightTick;
  }
  mouseDrag = false;
}

function mouseMoved(event) {
  if (mouseDrag) {
    delta = event.clientX - xPrev;
    dleft = (leftTick + delta); // while mousePressed it is still the leftClick from before
    dright = width - (rightTick + delta); // while mousePressed it is still the rightClick from before
  }
}
