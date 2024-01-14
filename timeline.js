import './tailwind.css'
import Two from 'https://cdn.skypack.dev/two.js@latest'

const timelineContainer = document.querySelector('#timelineContainer')
timelineContainer.innerHTML = ''
timelineContainer.onwheel = zoom

let width = timelineContainer.offsetWidth
let height = window.innerHeight/5 // Hardcoded, change based on index.html
let frameY = window.innerHeight - height

let currentDate = new Date(), currentYear = currentDate.getFullYear()

const tickSize = 10, tickWidth = 2
const minSpcBtwn = 30, maxSpcBtwn = 400
let spcBtwn = 50, numTick = width/spcBtwn, tickIncr = 1

let prevX = 0, mouseX = 0, mouseY = 0
let leftX = 0, leftYear = 1975
let bce = false

let timelineDrag = false, targetDrag = false
let targetPosition = 100
const targetSize = 5

let zoomRatio = -0.01

let two

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
  frameY = window.innerHeight - height

  two.width = width
  two.height = height

  numTick = width/spcBtwn
}

function draw() {
  two.clear()
  resize()
  currentDate = new Date()
  currentYear = currentDate.getFullYear()

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

  // let rcircle = two.makeCircle(leftX, height / 2, 5)
  // rcircle.stroke = 'blue'

  target()
  skip()
}

let tickBuffer = 0

function drawTick(x, ticksDrawn) {
  let tickYear = Math.abs(leftYear + (bce ? -ticksDrawn : ticksDrawn) - tickBuffer)
  if (tickYear == 0) {
    tickBuffer = 1
    tickYear = 1
  }

  if (tickYear <= currentYear) {
    let tick = two.makeLine(x, height/2 + tickSize, x, height/2 - tickSize)
    tick.stroke = 'black'
    tick.linewidth = tickWidth

    two.makeText(tickYear, x, height/2 + 20)
  }
}

let skipBackCount = 0, skipFrontCount = 0
let skipBack = false, skipFront = false

function mousePressed(event) {
  mouseX = event.clientX
  mouseY = event.clientY - frameY
  if (event.clientY > window.innerHeight - height) {
    prevX = mouseX
    if (inTarget(mouseX, mouseY)) {
      targetDrag = true
    } else if (inBackSkip(mouseX, mouseY)) {
      skipBack = true
    } else if (inFrontSkip(mouseX, mouseY)) {
      skipFront = true
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

function mouseReleased(event) {
  mouseX = event.clientX
  mouseY = event.clientY - frameY
  if (skipBack && inBackSkip(mouseX, mouseY)) {
    skipBackCount %= 3
    skipBackCount++
    leftYear -= skipBackCount * 5
  } else if (skipFront && inFrontSkip(mouseX, mouseY)) {
    skipFrontCount %= 3
    skipFrontCount++
    leftYear += skipFrontCount * 5
    if (currentYear < leftYear + numTick * tickIncr) {
      leftYear = Math.round(currentYear - numTick * tickIncr) + 1
    }
  }
  timelineDrag = false
  targetDrag = false
  skipBack = false
  skipFront = false
}

function mouseMoved(event) {
  mouseX = event.clientX
  mouseY = event.clientY - frameY
  if (timelineDrag) {
    let tempX = leftX + mouseX - prevX
    leftX = (tempX < 0 && currentYear < leftYear + numTick * tickIncr) ? 0 : tempX
    prevX = mouseX
  }
}

function zoom(event) {
  event.preventDefault()
  zoomRatio = spcBtwn * -0.0002 - 0.01

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
}

function target() {
  let target = two.makeCircle(targetPosition, height/2, targetSize)
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

function skip() {
  const skipY = 4*height/5

  const backVertices = [
    new Two.Vector(15, skipY),
    new Two.Vector(30, skipY - 10),
    new Two.Vector(30, skipY + 10)
  ]

  const frontVertices = [
    new Two.Vector(width - 15, skipY),
    new Two.Vector(width - 30, skipY - 10),
    new Two.Vector(width - 30, skipY + 10)
  ]

  let backSkip = two.makePath(backVertices, true)
  backSkip.fill = 'blue'
  backSkip.linewidth = 0

  let frontSkip = two.makePath(frontVertices, true)
  frontSkip.fill = 'blue'
  frontSkip.linewidth = 0
}

function inBackSkip(x, y) {
  const skipY = 4*height/5
  return inTriangle(x, y, 15, skipY, 30, skipY - 10, 30, skipY + 10)
}

function inFrontSkip(x, y) {
  const skipY = 4*height/5
  return inTriangle(x, y, width - 15, skipY, width - 30, skipY - 10, width - 30, skipY + 10)
}
