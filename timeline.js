import './tailwind.css'
import Two from 'https://cdn.skypack.dev/two.js@latest'

const timelineContainer = document.querySelector('#timelineContainer')
timelineContainer.innerHTML = ''
timelineContainer.onwheel = zoom

let width = timelineContainer.offsetWidth
let height = window.innerHeight/5 // Hardcoded, change based on index.html

let tickSize = 10
let minSpcBtwn = 30
let maxSpcBtwn = width
let spcBtwn = 50
let numTick = width/spcBtwn

let xPrev = 0, yPrev = 0
let delta = 0
let leftTick = 0, rightTick = leftTick + spcBtwn * (numTick - 1)
let dright = 0

let mouseDrag = false
let zoomRatio = -0.01

let tickIncr = 1;
let leftYear = 1950;

let two

let yearPlus = 0.0;

document.addEventListener('DOMContentLoaded', () => {

  two = new Two({
    type: Two.Types.svg,
    width: width,
    height: height
  }).appendTo(timelineContainer)

  two.renderer.domElement.style.background = 'rgb(238,238,228)'

  resize()

  two.bind('update', draw)
  two.play()

  document.addEventListener('mousedown', mousePressed)
  document.addEventListener('mouseup', mouseReleased)
  document.addEventListener('mousemove', mouseMoved)
  // document.addEventListener('wheel', zoom)

})

function resize() {
  width = timelineContainer.offsetWidth
  height = window.innerHeight/5 // Hardcoded, change based on index.html

  two.width = width
  two.height = height

  numTick = width/spcBtwn
}

function draw() {
  two.clear()
  resize()

  let mainLine = two.makeLine(0, height / 2, width, height / 2)
  mainLine.stroke = 'black'
  mainLine.linewidth = 2

  while (dright < 0) {
    dright += spcBtwn // visible not negative
  }
  
  let ticksDrawn = 0

  while (dright >= spcBtwn) {
    dright -= spcBtwn
    drawTick(width - dright, ticksDrawn)
    ticksDrawn += 1
  }

  // add circles for debugging if needed
  let rcircle = two.makeCircle(width - dright, height / 2, 5)
  rcircle.stroke = 'blue'

  while (ticksDrawn < numTick) {
    yearPlus = Math.floor((leftTick + delta)/spcBtwn)
    drawTick(width - dright - (ticksDrawn * spcBtwn), ticksDrawn)
    ticksDrawn += 1
  }

}

function drawTick(x, ticksDrawn) {
  let tick = two.makeLine(x, height/2 + tickSize, x, height/2 - tickSize)
  tick.stroke = 'black'
  tick.linewidth = 2

  let label = two.makeText(leftYear - ticksDrawn, x, height/2 + 20)
}

function mousePressed(event) {
  if (event.clientY > window.innerHeight - height) {
    xPrev = event.clientX
    yPrev = event.clientY

    delta = 0
    diff = dright
    mouseDrag = true
  }
}

function mouseReleased(event) {
  if (mouseDrag) {
    leftTick = (delta + leftTick) % spcBtwn
    while (leftTick < 0) {
      leftTick += spcBtwn
    }
    
    rightTick = leftTick + spcBtwn * (numTick - 1)

    dright = width - rightTick
    curr = dright
  }
  mouseDrag = false
}
let curr = dright
let diff = dright

function mouseMoved(event) {
  if (mouseDrag) {
    delta = event.clientX - xPrev
    dright = width - (rightTick + delta) // while mousePressed it is still the rightClick from before
    let prev = curr
    curr = dright
    diff += curr - prev
    while (diff < 0) {
      console.log('minus')
      diff += spcBtwn // visible not negative
      leftYear -= tickIncr
    }
    while (diff >= spcBtwn) {
      console.log('plus')
      diff -= spcBtwn
      leftYear += tickIncr
    }
    console.log(leftYear)
  }
}

function zoom(event) {
  event.preventDefault()
  
  let change = event.deltaY * zoomRatio
  if (spcBtwn > 100 && spcBtwn < 200) {
    zoomRatio -= change*0.001
  }
  // console.log(zoomRatio)
  
  spcBtwn += change
  while (spcBtwn < minSpcBtwn) {
    spcBtwn = minSpcBtwn
    change = 0
  }
  while (spcBtwn > maxSpcBtwn) {
    spcBtwn = maxSpcBtwn
    change = 0
  }

  let dshift = change * (width - dright - event.clientX) / spcBtwn
  dright -= dshift
}
