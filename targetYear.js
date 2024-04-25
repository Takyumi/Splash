import './tailwind.css'
import gsap from 'gsap'

const targetYear = document.querySelector('#year')

let windowWidth = window.innerWidth, windowHeight = window.innerHeight
const width = 200, height = 92
let divX = windowWidth - 250, divY = windowHeight/2 + height/2

gsap.set(targetYear, {
  x: divX,
  y: divY
})
targetYear.style.width = width + 'px'
targetYear.style.lineHeight = height + 'px'
targetYear.style.textAlign = 'center'
targetYear.style.verticalAlign = 'middle'
targetYear.style.fontSize = '36px'
targetYear.style.fontFamily = 'Spline Sans Mono,sans-serif'
targetYear.style.backgroundColor = 'transparent'
targetYear.style.cursor = 'pointer'
targetYear.style.outline = '1.5px solid white'
targetYear.style.borderRadius = '25px'

function fontColor(str, color) {
  return '<span style="color: ' + color + '">' + str + '</span>'
}

export function updateYear() {
  targetYear.innerHTML = fontColor(globalThis.targetYear, "white") + fontColor("|", "grey") + fontColor(globalThis.targetBCE, "white")
}

let drag = false
let mouseX = 0, mouseY = 0
let prevX = 0, prevY = 0

function withinTargetYearBounds(x, y) {
  return x > divX && x < divX + width && y > divY && y < divY + height
}

function resizeTargetYear(_) {
  if (divX > window.innerWidth - width) {
    divX = window.innerWidth - width
  }
  if (divY > window.innerHeight - height) {
    divY = window.innerHeight - height
  }
  gsap.set(targetYear, {
    x: divX,
    y: divY
  })
}

function targetYearMD(event) {
  event.preventDefault()
  mouseX = event.clientX
  mouseY = event.clientY
  prevX = mouseX
  prevY = mouseY
  drag = true
}

function targetYearMU(event) {
  event.preventDefault()
  mouseX = event.clientX
  mouseY = event.clientY
  drag = false
}

function targetYearMM(event) {
  event.preventDefault()
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

export { withinTargetYearBounds, resizeTargetYear, targetYearMD, targetYearMU, targetYearMM }
