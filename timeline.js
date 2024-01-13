import './tailwind.css'
import Two from 'https://cdn.skypack.dev/two.js@latest'

const timelineContainer = document.querySelector('#timelineContainer')
timelineContainer.innerHTML = ''
timelineContainer.onwheel = zoom

let width = timelineContainer.offsetWidth
let height = window.innerHeight/5 // Hardcoded, change based on index.html

let tickSize = 10, tickWidth = 2
let minSpcBtwn = 30, maxSpcBtwn = 400
let spcBtwn = 50, numTick = width/spcBtwn

let prevX = 0

let timelineDrag = false, targetDrag = false
let targetSize = 5

let zoomRatio = -0.01

let tickIncr = 1

let two

let leftX = 0, leftYear = 1
let bce = false, tickBCE = false

let targetPosition = 100;

let frameY = window.innerHeight - height
let mouseX = 0;
let mouseY = 0;

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

    leftYear += bce ? -tickIncr : tickIncr
  }
  while (leftX >= spcBtwn) {
    leftX -= spcBtwn
    leftYear -= bce ? -tickIncr : tickIncr
  }
  if (leftYear == 0) {
    bce = !bce
    leftYear = 1
  }

  tickBuffer = 0
  for (let i = 0; i <= numTick; i++) {
    drawTick(leftX + (i * spcBtwn), i);
  }

  // add circles for debugging if needed
  let rcircle = two.makeCircle(leftX, height / 2, 5)
  rcircle.stroke = 'blue'

  target()
}

let tickBuffer = 0

function drawTick(x, ticksDrawn) {
  let tick = two.makeLine(x, height/2 + tickSize, x, height/2 - tickSize)
  tick.stroke = 'black'
  tick.linewidth = tickWidth

  let tickYear = Math.abs(leftYear + (bce ? -ticksDrawn : ticksDrawn) - tickBuffer)
  if (tickYear == 0) {
    tickBuffer = 1
    tickYear = 1
  }

  two.makeText(tickYear, x, height/2 + 20)
}

function mousePressed(event) {
  if (event.clientY > window.innerHeight - height) {
    prevX = event.clientX
    if (inTarget(mouseX, mouseY)) {
      targetDrag = true
    } else {
      timelineDrag = true
    }
  }

}

function triangleArea(x1, y1, x2, y2, x3, y3) {
  return Math.abs((x1*(y2-y3) + x2*(y3-y1)+ x3*(y1-y2))/2.0)
}

function inTriangle(x, y, x1, y1, x2, y2, x3, y3) {
  let A = Math.round(triangleArea(x1, y1, x2, y2, x3, y3))
  let A1 = triangleArea(x, y, x2, y2, x3, y3)
  let A2 = triangleArea(x1, y1, x, y, x3, y3)
  let A3 = triangleArea(x1, y1, x2, y2, x, y)
  return (A == Math.round(A1 + A2 + A3))
}

function inTarget(x, y) {
  let inTargetCircle = (x - targetPosition)**2 + (y - height/2)**2 < targetSize**2
  let inTopTriangle = inTriangle(x, y, targetPosition, height/2 - 25, targetPosition - 5, height/2 - 35, targetPosition + 5, height/2 - 35)
  let inBottomTriangle = inTriangle(x, y, targetPosition, height/2 + 25, targetPosition - 5, height/2 + 35, targetPosition + 5, height/2 + 35)
  return inTargetCircle || inTopTriangle || inBottomTriangle
}

function mouseReleased(_event) {
  timelineDrag = false
  targetDrag = false
}

function mouseMoved(event) {
  if (timelineDrag) {
    leftX += event.clientX - prevX
    prevX = event.clientX
  }
  
  mouseX = event.clientX
  mouseY = event.clientY - frameY
}

function zoom(event) {
  event.preventDefault()

  if (spcBtwn > 100 && spcBtwn < 200) {
    zoomRatio = spcBtwn * -0.0002 + 0.01
  }

  let prevSpcBtwn = spcBtwn
  let change = event.deltaY * zoomRatio
  if (spcBtwn + change < minSpcBtwn) {
    change = minSpcBtwn - spcBtwn
    spcBtwn = minSpcBtwn
  } else if (spcBtwn + change > maxSpcBtwn) {
    change = maxSpcBtwn - spcBtwn
    spcBtwn = maxSpcBtwn
  } else {
    spcBtwn += change
  }

  let dshift = change * (event.clientX - leftX) / prevSpcBtwn
  leftX -= dshift
  if (change <= 0) {
    console.log(dshift, spcBtwn, leftX)
  }
}

function target() {
  let target = two.makeCircle(targetPosition, height/2, 5)
  target.stroke = 'red'
  // let targetLine = two.makeLine(targetPosition, height/2 + 30, targetPosition, height/2 - 30)
  // targetLine.stroke = 'red'
  // targetLine.linewidth = 1.5

  const bottomVertices = [
    new Two.Vector(targetPosition, height/2 + 25),
    new Two.Vector(targetPosition - 5, height/2 + 35),
    new Two.Vector(targetPosition + 5, height/2 + 35)
  ]

  const topVertices = [
    new Two.Vector(targetPosition, height/2 - 25),
    new Two.Vector(targetPosition - 5, height/2 - 35),
    new Two.Vector(targetPosition + 5, height/2 - 35)
  ]

  let targetBottom = two.makePath(bottomVertices, true)
  targetBottom.fill = 'red'
  targetBottom.linewidth = 0

  let targetTop = two.makePath(topVertices, true)
  targetTop.fill = 'red'
  targetTop.linewidth = 0

  if (targetDrag) {  
    targetPosition = mouseX
    target.fill = 'red'
  }
  
  let yearDiff = Math.floor((targetPosition - leftX) / spcBtwn)
  let targetYear = leftYear + (bce ? -yearDiff : yearDiff)
  let targetBCE = bce
  if (targetYear <= 0) {
    targetYear -= 1
    targetBCE = !targetBCE
  }
  two.makeText(Math.abs(targetYear) + (targetBCE ? " BCE" : " CE"), targetPosition, height/2 + 50)

}
