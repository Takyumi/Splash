import './tailwind.css'
import gsap from 'gsap'
import Two from 'two.js'
import { inGlobe } from './globe.js'
// TODO(gracexin2003): If visible = false, globe should rotate when being dragged from locationToggle's location

let windowWidth = window.innerWidth, windowHeight = window.innerHeight
const offsetWidth = 200, offsetHeight = 350
let defaultX = windowWidth - offsetWidth, defaultY = windowHeight - offsetHeight
let divX = defaultX, divY = defaultY
const width = 150, height = 150
let visible = true

globalThis.addPin = false

const locationToggle = document.querySelector('#location')
const two = new Two({width: width, height: height}).appendTo(locationToggle)

function resetLocationPin() {
  visible = true
  
  divX = defaultX
  divY = defaultY
  gsap.set(locationToggle, {
    x: divX,
    y: divY
  })
    
  const pinHead = two.makeCircle(width/2, height/2, 50)
  pinHead.fill = '#FF8000'
  pinHead.noStroke()
  
  const pinCenter = two.makeCircle(width/2, height/2, 20)
  pinCenter.fill = 'white'
  pinCenter.noStroke()

  const pinEnd = two.makeCircle()
  pinEnd.fill = 'black'
  pinEnd.noStroke()
  
  two.update()
}
resetLocationPin()

function withinLocationPinBounds(x, y) {
  return (x > divX && x < divX + width && y > divY && y < divY + height) && visible
}

function resizeLocationPin(_) {
  windowWidth = window.innerWidth
  windowHeight = window.innerHeight
  defaultX = windowWidth - offsetWidth
  defaultY = windowHeight - offsetHeight
  
  if (visible) {
    divX = defaultX
    divY = defaultY
    gsap.set(locationToggle, {
      x: divX,
      y: divY
    })
  }
}

let drag = false
let mouseX = 0, mouseY = 0
let prevX = 0, prevY = 0

function locationToggleMD(event) {
  event.preventDefault()
  mouseX = event.clientX
  mouseY = event.clientY
  prevX = mouseX
  prevY = mouseY
  drag = true
}

function locationToggleMU(event) {
  event.preventDefault()
  mouseX = event.clientX
  mouseY = event.clientY
  if (drag) {
    if (inGlobe()) {
      visible = false
      globalThis.addPin = true
      two.clear()
      two.update()
    }
    divX = defaultX
    divY = defaultY
    gsap.set(locationToggle, {
      x: divX,
      y: divY
    })
  }
  
  drag = false
}

function locationToggleMM(event) {
  event.preventDefault()
  mouseX = event.clientX
  mouseY = event.clientY
  if (drag) {
    divX += mouseX - prevX
    if (divX < 0) {
      divX = 0
    } else if (divX > window.innerWidth - width - 5) {
      divX = window.innerWidth - width - 5
    }
    divY += mouseY - prevY
    if (divY < 0) {
      divY = 0
    } else if (divY > window.innerHeight - height) {
      divY = window.innerHeight - height
    }
    prevX = mouseX
    prevY = mouseY
    gsap.set(locationToggle, {
      x: divX,
      y: divY
    })
  }
}

export { withinLocationPinBounds, resizeLocationPin, resetLocationPin, locationToggleMD, locationToggleMU, locationToggleMM }
