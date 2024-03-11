import './tailwind.css'
import gsap from 'gsap'

let divXs = [], divYs = []
const width = 450, height = 250

let newId = 0
let pinWindowDivs = new Map()

export function createPinWindowDiv() {
  let pinWindowDiv = document.createElement('div')
  pinWindowDiv.setAttribute('id', 'pinDiv' + newId)

  divXs.push(25)
  divYs.push(25)

  gsap.set(pinWindowDiv, {
    x: divXs[newId],
    y: divYs[newId]
  })

  pinWindowDiv.classList.add('fixed')
  pinWindowDiv.classList.add('bg-white')
  pinWindowDiv.classList.add('rounded-2xl')
  pinWindowDiv.classList.add('shadow-lg')

  pinWindowDiv.style.width = width + "px"
  pinWindowDiv.style.lineHeight = height + "px"
  pinWindowDiv.style.fontFamily = "Spline Sans Mono,sans-serif"
  pinWindowDiv.style.visibility = "visible"
  pinWindowDiv.style.paddingLeft = "10px"
  pinWindowDiv.style.border = "1px solid"

  let pinEvent = document.createElement('h2')
  pinEvent.style.fontSize = "36px"
  pinEvent.style.width = width + "px"
  pinEvent.style.lineHeight = "75px"
  pinEvent.style.verticalAlign = "text-top"
  let pinEventText = document.createTextNode("Event Name")
  pinEvent.appendChild(pinEventText)
  pinWindowDiv.appendChild(pinEvent)

  let pinDescription = document.createElement('p')
  pinDescription.style.fontSize = "20px"
  pinDescription.style.width = width + "px"
  pinDescription.style.height = height + "px"
  pinDescription.style.lineHeight = "25px"
  let pinDescriptionText = document.createTextNode("Event Description")
  pinDescription.appendChild(pinDescriptionText)
  pinWindowDiv.appendChild(pinDescription)

  document.body.insertBefore(pinWindowDiv, document.getElementById("year"))
  pinWindowDivs.set(newId, pinWindowDiv)

  return newId++
}

export function deletePinWindowDiv(id) {
  const element = document.getElementById('pinDiv' + id)
  element.remove()
  pinWindowDivs.delete(id)
}

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('mousedown', mousePressed)
  document.addEventListener('mouseup', mouseReleased)
  document.addEventListener('mousemove', mouseMoved)
})

let drag = false
let mouseX = 0, mouseY = 0
let prevX = 0, prevY = 0

function withinPinWindowBounds(x, y) {
  for (let i = 0; i < pinWindowDivs.size; i++)
    if (x > divXs[i] && x < divXs[i] + width && y > divYs[i] && y < divYs[i] + height)
      return true
  return false
}

function withinPinWindowIBounds(i, x, y) {
  return x > divXs[i] && x < divXs[i] + width && y > divYs[i] && y < divYs[i] + height
}

function resizePinWindow(_) {
  for (let i = 0; i < pinWindowDivs.size; i++) {
    if (divXs[i] > window.innerWidth - width) {
      divXs[i] = window.innerWidth - width
    }
    if (divYs[i] > window.innerHeight - height) {
      divYs[i] = window.innerHeight - height
    }
    let pinWindowDiv = pinWindowDivs.get(i)
    gsap.set(pinWindowDiv, {
      x: divXs[i],
      y: divYs[i]
    })
    pinWindowDivs.set(i, pinWindowDiv)
  }
}

export { withinPinWindowBounds, resizePinWindow }

let dragId = 0

function mousePressed(event) {
  if (pinWindowDivs.size == 0) return
  event.preventDefault()
  mouseX = event.clientX
  mouseY = event.clientY
  for (let i = pinWindowDivs.size - 1; i >= 0; i--) {
    if (withinPinWindowIBounds(i, mouseX, mouseY)) {
      prevX = mouseX
      prevY = mouseY
      dragId = i
      drag = true
    }
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
    divXs[dragId] += mouseX - prevX
    if (divXs[dragId] < 0) {
      divXs[dragId] = 0
    } else if (divXs[dragId] > window.innerWidth - width) {
      divXs[dragId] = window.innerWidth - width
    }
    divYs[dragId] += mouseY - prevY
    if (divYs[dragId] < 0) {
      divYs[dragId] = 0
    } else if (divYs[dragId] > window.innerHeight - height) {
      divYs[dragId] = window.innerHeight - height
    }
    prevX = mouseX
    prevY = mouseY

    let pinWindowDiv = pinWindowDivs.get(dragId)
    gsap.set(pinWindowDiv, {
      x: divXs[dragId],
      y: divYs[dragId]
    })
    pinWindowDivs.set(dragId, pinWindowDiv)
  }
}