import './tailwind.css'
import gsap from 'gsap'
import Two from 'https://cdn.skypack.dev/two.js@latest'
import { deletePin } from './globe'

// TODO(gxin): drag doesn't work for second added pin window

let two

let windowWidth = window.innerWidth, windowHeight = window.innerHeight
let divXs = [], divYs = []
const width = 425, height = 2*windowHeight/3
const textPadding = '50px'
const bottomPadding = '30px'

let moveClick = false, heightClick = false
let newId = 0
let pinWindowDivs = new Map()

export function createPinWindowDiv() {
  let pinWindowDiv = document.createElement('div')
  pinWindowDiv.setAttribute('id', 'pinDiv' + newId)

  let two = new Two({
    type: Two.Types.svg,
    width: width,
    height: height
  }).appendTo(pinWindowDiv);

  divXs.push(15)
  divYs.push(100)

  gsap.set(pinWindowDiv, {
    x: divXs[newId],
    y: divYs[newId]
  })

  pinWindowDiv.classList.add('fixed')
  pinWindowDiv.classList.add('rounded-xl')
  //pinWindowDiv.classList.add('shadow-lg')

  pinWindowDiv.style.width = width + "px"
  pinWindowDiv.style.maxHeight = height + "px"
  pinWindowDiv.style.fontFamily = "arial"
  pinWindowDiv.style.visibility = "visible"
  pinWindowDiv.style.backgroundColor = 'rgb(0,0,0,0.8)'
  pinWindowDiv.style.overflow = 'hidden'
  pinWindowDiv.style.border = '1px solid white'
  
  const windowMove = document.createElement('button')
  windowMove.id = 'windowMove'
  windowMove.style.position = 'absolute'
  windowMove.style.top = '0px'
  windowMove.style.left = '0px'
  windowMove.style.width = width*0.95 + 'px'
  windowMove.style.height = '100px'
  windowMove.style.backgroundColor = 'transparent' //#B0A3FF80
  windowMove.style.cursor = 'default'
  windowMove.style.boxSizing = 'border-box'

  pinWindowDiv.appendChild(windowMove)

  windowMove.addEventListener('mousedown', function(){
    moveClick = true
  })

  windowMove.addEventListener('mouseup', function(){
    moveClick = false
  })

  const windowDel = document.createElement('button')
  windowDel.id = 'windowDelete'
  windowDel.style.position = 'absolute'
  windowDel.style.top = '30px'
  windowDel.style.right = '17px'
  windowDel.style.width = '20px'
  windowDel.style.height = '20px'
  windowDel.style.backgroundColor = 'transparent'
  windowDel.style.cursor = 'pointer'
  windowDel.style.boxSizing = 'border-box'
  windowDel.style.borderRadius = '10px'
  // windowDel.style.display = 'flex'
  // windowDel.style.justifyContent = 'center'
  // windowDel.style.alignItems = 'center'

  const addImage = document.createElement('img')
  addImage.src = './image/plusIcon.png'
  addImage.style.width = '100%'
  addImage.style.height = '100%'
  addImage.style.opacity = '0.9'
  addImage.style.transform = 'rotate(45deg)'
  addImage.alt = 'save'

  windowDel.appendChild(addImage)
  pinWindowDiv.appendChild(windowDel)

  function deleteWindow() {
    deletePin()
    pinWindowDiv.remove()
  }

  windowDel.addEventListener('click', deleteWindow)

  const eventInput = document.createElement('input')
  eventInput.type = 'text'
  eventInput.id = 'eventInput'
  eventInput.placeholder = 'Event Title'
  eventInput.style.position = 'absolute'
  eventInput.style.left = textPadding
  eventInput.style.top = '30px'
  eventInput.style.fontSize = '24px'
  eventInput.style.maxHeight = '20px'
  eventInput.style.letterSpacing = '0px'
  eventInput.style.fontWeight = 'bold'
  eventInput.style.fontFamily = 'Arial'
  eventInput.style.color = 'white'
  eventInput.style.width = '200px'
  eventInput.style.backgroundColor = 'transparent'
  eventInput.style.outline = 'none'

  pinWindowDiv.appendChild(eventInput)

  const headerInput = document.createElement('input')
  headerInput.type = 'text'
  headerInput.id = 'headerInput'
  headerInput.placeholder = 'Enter Header'
  headerInput.style.position = 'absolute'
  headerInput.style.top = '110px'
  headerInput.style.fontSize = '18px'
  headerInput.style.left = textPadding
  headerInput.style.width = '350px'
  headerInput.style.height = '25px'
  headerInput.style.fontFamily = 'Arial'
  headerInput.style.letterSpacing = '0px'
  headerInput.style.color = 'white'
  headerInput.style.fontWeight = 'bold'
  headerInput.style.backgroundColor = 'transparent'
  headerInput.style.outline = 'none'

  pinWindowDiv.appendChild(headerInput)

  const descriptionInput = document.createElement('textarea')
  descriptionInput.id = 'descriptionInput'
  descriptionInput.placeholder = 'Enter Description'
  descriptionInput.style.position = 'absolute'
  descriptionInput.style.top = '150px'
  descriptionInput.style.left = textPadding
  descriptionInput.style.fontSize = '12px'
  descriptionInput.style.width = '350px'
  descriptionInput.style.height = windowHeight/3 + 'px'
  descriptionInput.style.outline = 'none'
  descriptionInput.style.fontFamily = 'Arial'
  descriptionInput.style.letterSpacing = '1px'
  descriptionInput.style.color = 'white'
  descriptionInput.style.backgroundColor = 'transparent'
  descriptionInput.style.resize = 'none'; // Optional, to prevent resizing

  pinWindowDiv.appendChild(descriptionInput)

  const inputYear = document.createElement('text')
  inputYear.id = 'inputYear'
  inputYear.textContent = `${globalThis.targetYear} ${globalThis.targetBCE}`
  inputYear.style.position = 'absolute'
  inputYear.style.fontSize = '18px'
  inputYear.style.top = '25px'
  inputYear.style.right = '50px'
  inputYear.style.width = '110px'
  inputYear.style.height = '30px'
  inputYear.style.fontWeight = 'bold'
  inputYear.style.paddingTop = '2px'
  inputYear.style.textAlign = 'center'
  inputYear.style.color = 'white'
  inputYear.style.backgroundColor
  inputYear.style.borderRadius = '20px'
  inputYear.style.border = '1.2px solid white'
  //inputYear.style.boxShadow = '0 0 7px 1px white'

  pinWindowDiv.appendChild(inputYear)

  const locationLat = document.createElement('text')
  locationLat.id = 'locationLat'
  locationLat.textContent = `LAT: ${globalThis.pinLatitude}`
  locationLat.style.color = 'transparent'
  locationLat.style.position = 'absolute'
  locationLat.style.top = '65px'
  locationLat.style.fontSize = '9px'
  locationLat.style.right = '15px'
  //locationLat.style.fontWeight = 'bold'
  locationLat.style.textAlign = 'right'
  //locationLat.style.fontFamily = "Spline Sans Mono,sans-serif"
  pinWindowDiv.appendChild(locationLat)

  const locationLng = document.createElement('text')
  locationLng.id = 'locationLng'
  locationLng.textContent = `LNG: ${globalThis.pinLongitude}`
  locationLng.style.color = 'transparent'
  locationLng.style.position = 'absolute'
  locationLng.style.top = '78px'
  locationLng.style.fontSize = '9px'
  locationLng.style.right = '15px'
  //locationLng.style.fontWeight = 'bold'
  locationLng.style.textAlign = 'right'
  //locationLng.style.fontFamily = "Spline Sans Mono,sans-serif"
  pinWindowDiv.appendChild(locationLng)

  const heightResize = document.createElement('button')
  heightResize.id = 'heightResize'
  heightResize.textContent = ''
  heightResize.style.position = 'absolute'
  heightResize.style.bottom = '0px'
  heightResize.style.left = '0px'
  heightResize.style.width = width + 'px'
  heightResize.style.height = '2px'
  heightResize.style.cursor = 'n-resize'
  heightResize.style.boxSizing = 'border-box'
  heightResize.style.backgroundColor = 'transparent'

  pinWindowDiv.appendChild(heightResize)

  heightResize.addEventListener('mousedown', function(){
    heightClick = true
    height += 100
  })

  heightResize.addEventListener('mouseup', function(){
    heightClick = false
  })
  

  const publishButton = document.createElement('button')
  publishButton.id = 'publishButton'
  publishButton.textContent = 'Publish'
  publishButton.style.position = 'absolute'
  publishButton.style.bottom = bottomPadding
  publishButton.style.right = '20px'
  publishButton.style.width = '100px'
  publishButton.style.height = '40px'
  publishButton.style.fontSize = '16px'
  publishButton.style.fontWeight = 'bold'
  publishButton.style.color = 'white'
  publishButton.style.backgroundColor = '#1bbfb4'
  publishButton.style.borderRadius = '12px'
  publishButton.style.cursor = 'pointer'
  publishButton.style.boxSizing = 'border-box'

  pinWindowDiv.appendChild(publishButton)

  let square = two.makeRectangle(30,40,12,12)
  square.fill = '#B0A3FF'
  square.stroke = 'none'
  square.rotation = Math.PI/4

  publishButton.addEventListener('click', function(){
    const eventData = document.getElementById('eventInput').value;
    if (!eventData) {
      console.error('Event title is required')
      return
    }

    const data = {
      eventTitle: eventData,
      header: document.getElementById('headerInput').value,
      description: document.getElementById('descriptionInput').value,
      year: inputYear.textContent,
      lat: locationLat.textContent,
      lng: locationLng.textContent,
    };

    const xhr = new XMLHttpRequest();

    xhr.open('POST', 'http://localhost:3000/writeFile');
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
      if (xhr.status === 200) {
        console.log('Data has been written to file successfully.');
      } else {
        console.error('Error writing to file:', xhr.statusText);
      }
    };

    xhr.onerror = function() {
      console.error('Network error occurred.');
    };

    xhr.send(JSON.stringify(data));

    deleteWindow()
  });

  // const saveButton = document.createElement('button')
  // saveButton.id = 'saveButton'
  // saveButton.textContent = 'Save'
  // saveButton.style.position = 'absolute'
  // saveButton.style.bottom = bottomPadding
  // saveButton.style.right = '130px'
  // saveButton.style.width = '70px'
  // saveButton.style.height = '40px'
  // saveButton.style.fontSize = '16px'
  // //saveButton.style.fontWeight = 'bold'
  // saveButton.style.color = 'black'
  // saveButton.style.backgroundColor = 'white'
  // saveButton.style.border = '1.5px solid darkgray'
  // saveButton.style.borderRadius = '12px'
  // saveButton.style.cursor = 'pointer'
  // saveButton.style.boxSizing = 'border-box'

  // pinWindowDiv.appendChild(saveButton)

  const addButton = document.createElement('button')
  addButton.id = 'addButton'
  addButton.style.position = 'absolute'
  addButton.style.bottom = bottomPadding
  addButton.style.left = textPadding
  addButton.style.width = '30px'
  addButton.style.height = '30px'
  addButton.style.cursor = 'pointer'
  addButton.style.boxSizing = 'border-box'

  //addButton.appendChild(addImage)
  pinWindowDiv.appendChild(addButton)

  addButton.addEventListener('click', function(){
    console.log('yay!')
  })


  // saveButton.addEventListener('click', function(){
  //   console.log('save was clicked')
  // })


  // let line = two.makeLine(50,90,width-15,90)
  // line.width = 0.3
  // line.stroke = 'black'
  
  two.update()

  document.body.insertBefore(pinWindowDiv, document.getElementById("year"))
  pinWindowDivs.set(newId, pinWindowDiv)

  return newId++
}

export function deletePinWindowDiv(id) {
  document.getElementById('pinDiv' + id)
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
  if (drag && moveClick == true) {
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

export { withinPinWindowBounds, resizePinWindow, pinWindowMD, pinWindowMU, pinWindowMM}
