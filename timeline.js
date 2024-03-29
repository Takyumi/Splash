import './tailwind.css'
import { updateYear, withinTargetYearBounds } from "./targetYear.js"
import { withinPinWindowBounds } from "./pinWindow.js"
import { withinLocationPinBounds } from "./locationToggle.js";
import Two from 'https://cdn.skypack.dev/two.js@latest'

const timelineContainer = document.querySelector('#timelineContainer')
timelineContainer.innerHTML = ''
timelineContainer.onwheel = zoom

let width = timelineContainer.offsetWidth
let height = window.innerHeight/5 // Hardcoded, change based on index.html
let frameY = window.innerHeight - height

let currentDate = new Date(), currentYear = currentDate.getFullYear()

const tickSize = 5, tickWidth = 1.7
let spcBtwn = 50, numTick = width / spcBtwn
let tickYears = [1, 10, 100, 1000, 1000000], tickYearIdx = 0
let minSpcBtwns = [30, 30, 30, 30, width/5]
let maxSpcBtwns = [width/4, 300, 300, 300, width/2]

let prevX = 0, mouseX = 0, mouseY = 0
let leftX = 0, leftYear = 0
let bce = false

let timelineDrag = false, targetDrag = false
let targetPosition = 100
const targetSize = 5

globalThis.yearString = Math.floor(leftYear + (targetPosition/spcBtwn)) + (bce ? " BCE" : " CE")

let zoomRatio = -0.01

var amplitudeCounter = 0
var amplitudePink = 0
var amplitudeBlue = 8
var amplitudeWhite = 5
var frequency = 10
var points = 100

var counterPink = 0
var counterBlue = 0
var counterWhite = 0

var amplitudePinkIncrease = true
var amplitudeBlueIncrease = true
var amplitudeWhiteIncrease = true

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

  bce = (tickYearIdx == 0) ? (leftYear <= 0) : (leftYear < 0)

  numTick = width / spcBtwn
}

function draw() {
  two.clear()
  resize()
  currentDate = new Date()
  currentYear = currentDate.getFullYear()

  while (leftX < 0) {
    leftX += spcBtwn
    leftYear += tickYears[tickYearIdx]
  }
  while (leftX >= spcBtwn) {
    leftX -= spcBtwn
    leftYear -= tickYears[tickYearIdx]
  }
  leftYear = Math.floor(leftYear / tickYears[tickYearIdx]) * tickYears[tickYearIdx]
  bce = (tickYearIdx == 0) ? (leftYear <= 0) : (leftYear < 0)

  tickBuffer = 0
  for (let i = 0; i <= numTick; i++) {
    drawTick(leftX + (i * spcBtwn), i);
  }

  var amplitudeOffset = Math.random()

  // let rcircle = two.makeCircle(leftX, height / 2, 5)
  // rcircle.stroke = 'blue'

  var wavePink = new Two.Path([], false, false)
  wavePink.noFill()

  var wavePink2 = new Two.Path([], false, false)
  wavePink2.noFill()

  var waveBlue = new Two.Path([], false, false)
  waveBlue.noFill()

  var waveBlue2 = new Two.Path([], false, false)
  waveBlue2.noFill()

  var waveWhite = new Two.Path([], false, false)
  waveWhite.noFill()

  var waveWhite2 = new Two.Path([], false, false)
  waveWhite2.noFill()

  amplitudeCounter += 1
  counterPink += 0.1
  counterBlue += 0.3
  counterWhite += 0.4

  if (amplitudeCounter == 5){
    if (amplitudePink <= -10){
      amplitudePinkIncrease = true
    } else if (amplitudePink >= 10){
      amplitudePinkIncrease = false
    }

    if (amplitudeBlue <= -10){
      amplitudeBlueIncrease = true
    } else if (amplitudeBlue >= 10){
      amplitudeBlueIncrease = false
    }

    if (amplitudeWhite <= -10){
      amplitudeWhiteIncrease = true
    } else if (amplitudeWhite >= 10){
      amplitudeWhiteIncrease = false
    }

    if (amplitudePinkIncrease == true){
      amplitudePink += amplitudeOffset
    } else {
      amplitudePink -= amplitudeOffset
    }

    if (amplitudeBlueIncrease == true){
      amplitudeBlue += amplitudeOffset
    } else {
      amplitudeBlue -= amplitudeOffset
    }

    if (amplitudeWhiteIncrease == true){
      amplitudeWhite += amplitudeOffset
    } else {
      amplitudeWhite -= amplitudeOffset
    }
    
    amplitudeCounter = 0
  }

  // console.log(counter)
  // console.log(width)

  for (var i = 0; i <= points; i++) {
    var x = (i / points) * (width*2) + counterPink
    var y = height/2 + amplitudePink * Math.sin((i / points) * Math.PI * frequency)
    wavePink.vertices.push(new Two.Anchor(x,y))
  }

  for (var i = 0; i <= points; i++) {
    var x = -(i / points) * (width*2) + counterPink
    var y = height/2 + amplitudePink * -Math.sin((i / points) * Math.PI * frequency)
    wavePink2.vertices.push(new Two.Anchor(x,y))
  }

  for (var i = 0; i <= points; i++) {
    var x = (i / points) * (width*2) + (counterBlue)
    var y = height/2 + amplitudeBlue * Math.sin((i / points) * Math.PI * frequency)
    waveBlue.vertices.push(new Two.Anchor(x,y))
  }

  for (var i = 0; i <= points; i++) {
    var x = -(i / points) * (width*2) + (counterBlue)
    var y = height/2 + amplitudeBlue * -Math.sin((i / points) * Math.PI * frequency)
    waveBlue2.vertices.push(new Two.Anchor(x,y))
  }

  for (var i = 0; i <= points; i++) {
    var x = (i / points) * (width*2) + (counterWhite)
    var y = height/2 + amplitudeWhite * Math.sin((i / points) * Math.PI * frequency)
    waveWhite.vertices.push(new Two.Anchor(x,y))
  }

  for (var i = 0; i <= points; i++) {
    var x = -(i / points) * (width*2) + (counterWhite)
    var y = height/2 + amplitudeWhite * -Math.sin((i / points) * Math.PI * frequency)
    waveWhite2.vertices.push(new Two.Anchor(x,y))
  }

  if (counterPink >= width) {
    counterPink = 0
  }

  if (counterBlue >= width) {
    counterBlue = 0
  }

  if (counterWhite >= width) {
    counterWhite = 0
  }

  console.log(width)
  console.log(counterBlue)

  wavePink.stroke = '#F077F8'
  wavePink.linewidth = 1.5

  wavePink2.stroke = '#F077F8'
  wavePink2.linewidth = 1.5

  waveBlue.stroke = '#4BBFF5'
  waveBlue.linewidth = 1.5

  waveBlue2.stroke = '#4BBFF5'
  waveBlue2.linewidth = 1.5

  waveWhite.stroke = 'black'
  waveWhite.linewidth = 1

  waveWhite2.stroke = 'black'
  waveWhite2.linewidth = 1

  two.add(wavePink)
  two.add(wavePink2)
  two.add(waveBlue)
  two.add(waveBlue2)
  two.add(waveWhite)
  two.add(waveWhite2)

  target()
}

let tickBuffer = 0

function drawTick(x, ticksDrawn) {
  let tickYear = leftYear + ticksDrawn * tickYears[tickYearIdx] - tickBuffer
  if (tickYear == 0) {
    tickYear = (tickYearIdx == 0) ? -1 : 1
  } else if (tickYear < 0 && tickYearIdx == 0) {
    tickYear -= tickYears[tickYearIdx]
  }

  if (tickYear <= currentYear) {
    let tick = two.makeLine(x, (height/2 - 20) + tickSize, x, (height/2 - 20) - tickSize)
    tick.stroke = 'black'
    tick.linewidth = tickWidth

    two.makeText(Math.abs(tickYear), x, height/2 - 37)
  }
}

function mousePressed(event) {
  mouseX = event.clientX
  mouseY = event.clientY
  if (withinTargetYearBounds(mouseX, mouseY)
    || withinLocationPinBounds(mouseX, mouseY)
    || withinPinWindowBounds(mouseX, mouseY)) {
    return
  }
  mouseY -= frameY
  if (event.clientY > window.innerHeight - height) {
    prevX = mouseX
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
  let inTopTriangle = inTriangle(x, y, targetPosition, height/2 - 15, targetPosition - 8, height/2 - 25, targetPosition + 8, height/2 - 25)
  let inBottomTriangle = inTriangle(x, y, targetPosition, height/2 + 15, targetPosition - 8, height/2 + 25, targetPosition + 8, height/2 + 25)
  return inTargetCircle || inTopTriangle || inBottomTriangle
}

function mouseReleased(event) {
  mouseX = event.clientX
  mouseY = event.clientY - frameY
  timelineDrag = false
  targetDrag = false
}

function mouseMoved(event) {
  mouseX = event.clientX
  mouseY = event.clientY - frameY
  if (timelineDrag) {
    let tempX = leftX + mouseX - prevX
    leftX = (!bce && tempX < 0 && currentYear < leftYear + numTick * tickYears[tickYearIdx]) ? 0 : tempX
    counter += Math.abs(tempX)
    prevX = mouseX
  }
}

function zoom(event) {
  event.preventDefault()
  zoomRatio = spcBtwn * -0.0002 - 0.01

  let prevSpcBtwn = spcBtwn
  let prevLeftYear = leftYear
  let change = event.deltaY * zoomRatio
  if (prevSpcBtwn + change < minSpcBtwns[tickYearIdx] && change < 0) {
    tickYearIdx++
    if (tickYearIdx < tickYears.length - 1) {
      spcBtwn = (prevSpcBtwn) * 10
      leftYear = Math.ceil(leftYear / tickYears[tickYearIdx]) * tickYears[tickYearIdx]
      leftX += (leftYear - prevLeftYear) / tickYears[tickYearIdx - 1] * prevSpcBtwn
      if (leftYear <= 0 && tickYearIdx == 1) {
        leftX += prevSpcBtwn
      }
      return
    }
    if (tickYearIdx == tickYears.length - 1) {
      spcBtwn = width / 4.5
    } else {
      tickYearIdx--
      spcBtwn = minSpcBtwns[tickYearIdx]
    }
  } else if (prevSpcBtwn + change > maxSpcBtwns[tickYearIdx] && change > 0) {
    if (tickYearIdx > 0) {
      tickYearIdx--
      spcBtwn = (prevSpcBtwn) / 10
      leftYear -= Math.floor(leftX / spcBtwn) * tickYears[tickYearIdx]
      if (prevLeftYear <= 0 && tickYearIdx == 0) {
        leftYear += tickYears[tickYearIdx]
      }
      leftX %= spcBtwn
      return
    }
    spcBtwn = maxSpcBtwns[tickYearIdx]
  } else {
    spcBtwn += event.deltaY * zoomRatio
  }
  leftYear = Math.ceil(leftYear / tickYears[tickYearIdx]) * tickYears[tickYearIdx]
  change = spcBtwn - prevSpcBtwn

  let dshift = change * (event.clientX - leftX) / prevSpcBtwn
  leftX -= dshift
}

function target() {
  // let target = two.makeCircle(targetPosition, height/2, targetSize)
  // target.stroke = 'red'

  const bottomVertices = [
    new Two.Vector(targetPosition, height/2 + 15),
    new Two.Vector(targetPosition - 8, height/2 + 25),
    new Two.Vector(targetPosition + 8, height/2 + 25)
  ]

  const topVertices = [
    new Two.Vector(targetPosition, height/2 - 15),
    new Two.Vector(targetPosition - 8, height/2 - 25),
    new Two.Vector(targetPosition + 8, height/2 - 25)
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
  
  let yearDiff = Math.floor((targetPosition - leftX) * tickYears[tickYearIdx] / spcBtwn)
  let targetYear = leftYear + yearDiff
  if (targetYear == 0) {
    targetYear = (tickYearIdx == 0) ? -1 : 1
  } else if (targetYear < 0 && tickYearIdx == 0) {
    targetYear -= tickYears[tickYearIdx]
  }
  let targetBCE = (tickYearIdx == 0) ? (targetYear <= 0) : (targetYear < 0)
  globalThis.targetYear = Math.abs(targetYear)
  globalThis.targetBCE = targetBCE ? "BCE" : "CE"
  updateYear()
  two.makeText(Math.abs(targetYear) + (targetBCE ? " BCE" : " CE"), targetPosition, height/2 + 50)
}

