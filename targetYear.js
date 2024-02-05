import './tailwind.css'
import gsap from 'gsap'

const targetYear = document.querySelector('#year')

let divX = 100, divY = 100
const width = 200, height = 92

gsap.set(targetYear, {
  x: divX,
  y: divY
})
targetYear.style.width = width + "px"
targetYear.style.lineHeight = height + "px"
targetYear.style.textAlign = "center"
targetYear.style.verticalAlign = "middle"
targetYear.style.fontSize = "36px";
targetYear.style.fontFamily = "Spline Sans Mono,sans-serif";

function fontColor(str, color) {
  return '<span style="color: ' + color + '">' + str + '</span>';
}

export function updateYear() {
  targetYear.innerHTML = fontColor(globalThis.targetYear, "black") + fontColor("|", "grey") + fontColor(globalThis.targetBCE, "black")
}

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('mousedown', mousePressed)
  document.addEventListener('mouseup', mouseReleased)
  document.addEventListener('mousemove', mouseMoved)
})

let drag = false
let mouseX = 0, mouseY = 0
let prevX = 0, prevY = 0

function withinBounds(x, y) {
  return x > divX && x < divX + width && y > divY && y < divY + height
}

function mousePressed(event) {
  mouseX = event.clientX
  mouseY = event.clientY
  if (withinBounds(mouseX, mouseY)) {
    prevX = mouseX
    prevY = mouseY
    drag = true
  }
}

function mouseReleased(event) {
  mouseX = event.clientX
  mouseY = event.clientY
  drag = false
}

function mouseMoved(event) {
  mouseX = event.clientX
  mouseY = event.clientY
  if (drag) {
    divX += mouseX - prevX
    if (divX < 0) {
      divX = 0
    } else if (divX > window.innerWidth - width) {
      divX = window.innerWidth - width
    }
    divY += mouseY - prevY
    if (divY < 0) {
      divY = 0
    } else if (divY > window.innerHeight - height) {
      divY = window.innerHeight - height
    }
    prevX = mouseX
    prevY = mouseY
    gsap.set(targetYear, {
      x: divX,
      y: divY
    })
  }
}