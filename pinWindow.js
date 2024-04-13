import './tailwind.css'
import gsap from 'gsap'
import Two from 'https://cdn.skypack.dev/two.js@latest'

// TODO(gxin): drag doesn't work for second added pin window

let two

let divXs = [], divYs = []
const width = 425, height = 325

let newId = 0
let pinWindowDivs = new Map()

export function createPinWindowDiv() {
  let pinWindowDiv = document.createElement('div')
  pinWindowDiv.setAttribute('id', 'pinDiv' + newId)

  divXs.push(15)
  divYs.push(70)

  gsap.set(pinWindowDiv, {
    x: divXs[newId],
    y: divYs[newId]
  })

  let two = new Two({
    type: Two.Types.svg,
    width: width,
    height: height
  }).appendTo(pinWindowDiv);

  pinWindowDiv.classList.add('fixed')
  pinWindowDiv.classList.add('bg-white')
  pinWindowDiv.classList.add('rounded-xl')
  pinWindowDiv.classList.add('shadow-lg')

  pinWindowDiv.style.width = width + "px"
  pinWindowDiv.style.lineHeight = height + "px"
  pinWindowDiv.style.fontFamily = "arial"
  pinWindowDiv.style.visibility = "visible"
  pinWindowDiv.style.paddingLeft = "20px"
  pinWindowDiv.style.backgroundColor = 'white'
  pinWindowDiv.style.overflow = 'visible'
  
  //pinWindowDiv.style.border = "0.2px solid rgb(71,71,71)"

  const eventInput = document.createElement('input')
  eventInput.type = 'text'
  eventInput.id = 'eventInput'
  eventInput.placeholder = 'Event Title'
  eventInput.style.position = 'absolute'
  eventInput.style.left = '50px'
  eventInput.style.top = '10px'
  eventInput.style.fontSize = '24px'
  eventInput.style.width = '270px'
  eventInput.style.maxHeight = '45px'
  eventInput.style.letterSpacing = '0px'
  eventInput.style.fontWeight = 'bold'
  eventInput.style.fontFamily = 'Arial'
  //eventInput.style.outline = 'none'

  pinWindowDiv.appendChild(eventInput)

  const headerInput = document.createElement('input')
  headerInput.type = 'text'
  headerInput.id = 'eventInput'
  headerInput.placeholder = 'Enter Header'
  headerInput.style.position = 'absolute'
  headerInput.style.top = '100px'
  headerInput.style.fontSize = '18px'
  headerInput.style.width = '370px'
  headerInput.style.height = '25px'
  headerInput.style.fontFamily = 'Arial'
  headerInput.style.letterSpacing = '0px'
  headerInput.style.fontWeight = 'bold'
  headerInput.style.backgroundColor = 'transparent'

  pinWindowDiv.appendChild(headerInput)

  const descriptionInput = document.createElement('input')
  descriptionInput.type = 'text'
  descriptionInput.id = 'eventInput'
  descriptionInput.placeholder = 'Enter Description'
  descriptionInput.style.position = 'absolute'
  descriptionInput.style.top = '120px'
  descriptionInput.style.fontSize = '12px'
  descriptionInput.style.width = '370px'
  descriptionInput.style.height = '50px'
  //descriptionInput.style.outline = 'none'
  descriptionInput.style.fontFamily = 'Arial'
  descriptionInput.style.letterSpacing = '1px'
  descriptionInput.style.backgroundColor = 'transparent'

  pinWindowDiv.appendChild(descriptionInput)

  const publishButton = document.createElement('button')
  publishButton.id = 'mybutton'
  publishButton.textContent = 'Publish'
  //publishButton.style.position = 'relative'
  publishButton.style.padding = '10px 10px'
  // publishButton.style.top = (height - 155) + 'px'
  // publishButton.style.width = '100px'
  // publishButton.style.maxHeight = '30px'
  publishButton.style.fontSize = '5px'
  publishButton.style.color = 'black'
  publishButton.style.backgroundColor = '#7ED4E7'
  publishButton.style.border = 'none'
  publishButton.style.borderRadius = '5px'
  publishButton.style.cursor = 'pointer'
  publishButton.style.outline = 'none'
  console.log((height - 25) + 'px')

  pinWindowDiv.appendChild(publishButton)

  publishButton.addEventListener('click', function(){
    console.log('button was clicked')
  })

  let square = two.makeRectangle(8,32,12,12)
  square.fill = '#B0A3FF'
  square.stroke = 'none'
  square.rotation = Math.PI/4

  let line = two.makeLine(0,90,width-42,90)
  line.width = 0.3
  line.stroke = 'black'

  
  two.update()

  document.body.insertBefore(pinWindowDiv, document.getElementById("year"))
  pinWindowDivs.set(newId, pinWindowDiv)

  return newId++
}

// document.addEventListener('DOMContentLoaded', () => {
//   two = new Two({
//     type: Two.Types.svg,
//     width: width,
//     height: height
//   }).appendTo(pinWindowDiv)

//   two.bind('update', draw)
//   two.play()
// })

export function deletePinWindowDiv(id) {
  const element = document.getElementById('pinDiv' + id)
  element.remove()
  pinWindowDivs.delete(id)
}

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

let dragId = 0

function pinWindowMD(event) {
  //event.preventDefault()
  mouseX = event.clientX
  mouseY = event.clientY
  for (let i = pinWindowDivs.size - 1; i >= 0; i--) {
    if (withinPinWindowIBounds(i, mouseX, mouseY)) {
      prevX = mouseX
      prevY = mouseY
      dragId = i
      drag = true
      break
    }
  }
}

function pinWindowMU(event) {
  event.preventDefault()
  mouseX = event.clientX
  mouseY = event.clientY
  drag = false
}

function pinWindowMM(event) {
  event.preventDefault()
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

export { withinPinWindowBounds, resizePinWindow, pinWindowMD, pinWindowMU, pinWindowMM }
