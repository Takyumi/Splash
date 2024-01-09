import './tailwind.css'
import Two from 'https://cdn.skypack.dev/two.js@latest'

const timelineContainer = document.querySelector('#timelineContainer')
timelineContainer.innerHTML = ''
timelineContainer.onwheel = zoom

let width = timelineContainer.offsetWidth
let height = window.innerHeight/5 // Hardcoded, change based on index.html

let tickSize = 10, tickWidth = 2
let minSpcBtwn = 30, maxSpcBtwn = width
let spcBtwn = 50, numTick = width/spcBtwn

let prevX = 0

let mouseDrag = false
let zoomRatio = -0.01

let tickIncr = 1

let two

let leftX = 0, leftYear = 1950

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

  while (leftX < 0) {
    leftX += spcBtwn
    leftYear += tickIncr
  }
  while (leftX >= spcBtwn) {
    leftX -= spcBtwn
    leftYear -= tickIncr
  }

  for (let i = 0; i <= numTick; i++) {
    drawTick(leftX + (i * spcBtwn), i);
  }

  // add circles for debugging if needed
  let rcircle = two.makeCircle(leftX, height / 2, 5)
  rcircle.stroke = 'blue'
}

function drawTick(x, ticksDrawn) {
  let tick = two.makeLine(x, height/2 + tickSize, x, height/2 - tickSize)
  tick.stroke = 'black'
  tick.linewidth = tickWidth

  two.makeText(leftYear + ticksDrawn, x, height/2 + 20)
}

function mousePressed(event) {
  if (event.clientY > window.innerHeight - height) {
    prevX = event.clientX
    mouseDrag = true
  }
}

function mouseReleased(event) {
  mouseDrag = false
}

function mouseMoved(event) {
  if (mouseDrag) {
    leftX += event.clientX - prevX
    prevX = event.clientX
    console.log(leftX)
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

  let dshift = change * (event.clientX - leftX) / spcBtwn
  leftX -= dshift
}
