import './tailwind.css'
import gsap from 'gsap'
import Two from 'https://cdn.skypack.dev/two.js@latest'
import { inGlobe } from './globe.js'
// TODO(gracexin2003): If visible = false, globe should rotate when being dragged from locationToggle's location

let windowWidth = window.innerWidth, windowHeight = window.innerHeight
const offsetWidth = 150, offsetHeight = 310
let defaultX = windowWidth - offsetWidth, defaultY = 7*windowHeight/10
let divX = defaultX, divY = defaultY
const width = 50, height = 100, pinTopSize = 25
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

  const pinTopLeftVertices = [
    new Two.Vector(width/2,height/2 + 40),
    new Two.Vector(width/2 - pinTopSize, height/2 -10),
    new Two.Vector(width/2 + pinTopSize,height/2 -10)
  ]

  let pinTopLeft = two.makePath(pinTopLeftVertices, true)
  pinTopLeft.fill = '#edb92b'
  pinTopLeft.stroke = 'none'
    
  const pinHead = two.makeCircle(width/2, height/2 - 5, 25)
  pinHead.fill = '#edb92b'
  pinHead.noStroke()

  const pinCenterShadow = two.makeCircle(width/2 + 3, height/2 - 5 + 3, 14)
  pinCenterShadow.fill = 'transparent'
  pinCenterShadow.stroke = 'rgb(150, 77, 3)'
  pinCenterShadow.linewidth = 5
  
  const pinCenter = two.makeCircle(width/2, height/2 - 5, 14)
  pinCenter.fill = 'transparent'
  pinCenter.stroke = 'white'
  pinCenter.linewidth = 5

  // const pinEnd = two.makeCircle()
  // pinEnd.fill = 'black'
  // pinEnd.noStroke()
  
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
