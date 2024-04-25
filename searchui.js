import './tailwind.css'
import gsap from 'gsap'
import Two from 'https://cdn.skypack.dev/two.js@latest'
import { createPinFromCoords, deletePin } from './globe'

let two

const searchui = document.querySelector('#search')

let divX, divY
let width, height
var searchClick = false
let addSearchDiv = false
let originalHeight = 35
const textPadding = '50px'
let divXs = [], divYs = []
const windowWidth = 425, windowHeight = 2*window.innerHeight/3

divX = 15; divY = 15;
width = 480; height = 35;

let moveClick = false
let drawUIon = false

searchui.style.width = width + "px"
searchui.style.lineHeight = height + "px"
searchui.style.textAlign = "center"
searchui.style.verticalAlign = "middle"
searchui.style.fontSize = "36px"
searchui.style.fontFamily = "Arial"
searchui.style.backgroundColor = 'transparent'
searchui.style.outline = '1.2px solid white'
searchui.style.overflow = 'hidden'

const searchImg = document.createElement('img')
searchImg.src = './image/searchIcon.png'
searchImg.width = 30
searchImg.height = 30
searchImg.style.position = 'absolute'
searchImg.style.left = '5px'
searchImg.style.top = '3px'

searchui.appendChild(searchImg)

const textInput = document.createElement('input')
textInput.type = 'text'
textInput.id = 'textInput'
textInput.style.position = 'absolute'
textInput.placeholder = 'Search'
textInput.style.fontSize = '18px'
textInput.style.left = '40px'
textInput.style.top = '5px'
textInput.style.width = '300px'
textInput.style.height = '25px'
textInput.style.outline = 'none'
textInput.style.fontFamily = ''
textInput.style.backgroundColor = 'transparent'
textInput.style.color = 'white'

searchui.appendChild(textInput)

textInput.addEventListener('input', function(event) {
  //console.log(event.target.value)
})

document.addEventListener('click', function(event) {
  if (event.target === searchui
   || event.target === searchImg) {
    searchClick = true
    addSearchDiv = true
    textInput.focus();
  } else if (event.target === textInput
          || event.target.id.includes('nextBtn')
          || event.target.id.includes('prevBtn')) {
    searchClick = true
    addSearchDiv = true
  } else {
    searchClick = false
    addSearchDiv = false
  }
});

const countOccurrences = (text, searchString) => {
  const regex = new RegExp(`"${searchString}":`, 'g')
  return (text.match(regex) || []).length
}

let index = 0, eventTitleCount

function deleteSearchList() {
  for (let tempIdx = 0; tempIdx < eventTitleCount; tempIdx += 10) {
    for(let i = 0; i < (eventTitleCount - tempIdx) && i < 10; i++){
      let idx = tempIdx + i
  
      const searchList = document.querySelector('#search' + idx)
      if (searchList) {
        searchui.removeChild(searchList)
      }
      searchList?.remove()
  
      const searchYears = document.querySelector('#searchYear' + idx)
      if (searchYears) {
        searchui.removeChild(searchYears)
      }
      searchYears?.remove()
    }
  
    const nextBtn = document.querySelector('#nextBtn' + tempIdx)
    if (nextBtn) {
      searchui.removeChild(nextBtn)
    }
    nextBtn?.remove()
  
    const prevBtn = document.querySelector('#prevBtn' + tempIdx)
    if (prevBtn) {
      searchui.removeChild(prevBtn)
    }
    prevBtn?.remove()
  }
}

const draw = () => {
  if (!searchClick) {
    two.clear()
    height = 35
    two.height = height
    searchui.style.height = height + 'px'
    deleteSearchList()
  } else if (addSearchDiv) {
    //console.log('search is active')
    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'http://localhost:3000/readFile')
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          let textData = xhr.responseText
          eventTitleCount = countOccurrences(textData, "eventTitle")
          //console.log(`Number of 'eventTitle' occurrences: ${eventTitleCount}`)
          //console.log('textData', textData)

          const eventTitles = []
          const regexTitles = /"eventTitle":"(.*?)"(?=,|"header")/g
          let matchEventTitles

          const eventYears = []
          const regexYears = /"year":"(.*?)"(?=,|"lat")/g
          let matchEventYears

          const eventHeader = []
          const regexHeader = /"header":"(.*?)"(?=,|"description")/g
          let matchEventHeader

          const eventDescription = []
          const regexDescription = /"description":"(.*?)"(?=,|"year")/g
          let matchEventDescription

          const eventLat = []
          const regexLat = /"lat":"(.*?)"(?=,|"lng")/g
          let matchEventLat

          const eventLng = []
          const regexLng = /"lng":"(.*?)"(?=|"})/g
          let matchEventLng
  

          // let match = textData.match(/"eventTitle":"(.*?)","header"/)
          // let eventTitle = match ? match[1] : "" // This stores the matched group if found, otherwise empty string
          // //console.log(eventTitle)

          while ((matchEventTitles = regexTitles.exec(textData)) !== null) {
            eventTitles.push(matchEventTitles[1]); 
          }

          while ((matchEventYears = regexYears.exec(textData)) !== null) {
            eventYears.push(matchEventYears[1]); 
          }

          while ((matchEventHeader = regexHeader.exec(textData)) !== null) {
            eventHeader.push(matchEventHeader[1]); 
          }

          while ((matchEventDescription = regexDescription.exec(textData)) !== null) {
            eventDescription.push(matchEventDescription[1]); 
          }

          while ((matchEventLat = regexLat.exec(textData)) !== null) {
            eventLat.push(matchEventLat[1]); 
          }

          while ((matchEventLng = regexLng.exec(textData)) !== null) {
            eventLng.push(matchEventLng[1]); 
          }

          display10()

          function display10() {
            searchui.style.backgroundColor = 'rgb(0,0,0,0.8)'
            let searchLine = two.makeLine(0, originalHeight, width, originalHeight)
            searchLine.stroke = 'white'

            for (var i = 0; i < (eventTitleCount - index) && i < 10; i++) {
              let idx = index + i
              height = 2 * originalHeight / 3 + 13 + 30 * i
  
              const searchList = document.createElement('button')
              searchList.id = 'search' + idx
              searchList.textContent = eventTitles[idx]
              searchList.style.position = 'absolute'
              searchList.style.top = height + 'px'
              searchList.style.left = '40px'
              searchList.style.width = width + 'px'
              searchList.style.textAlign = 'left'
              searchList.style.height = '30px'
              searchList.style.fontSize = '16px'
              searchList.style.color = 'white'
              searchList.style.backgroundColor = 'transparent'
              searchList.style.cursor = 'pointer'
  
              searchui.appendChild(searchList)
  
              const searchYears = document.createElement('text')
              searchYears.id = 'searchYear' + idx
              searchYears.textContent = eventYears[idx]
              searchYears.style.position = 'absolute'
              searchYears.style.top = height + 'px'
              searchYears.style.right = '20px'
              searchYears.style.textAlign = 'right'
              searchYears.style.height = '30px'
              searchYears.style.fontSize = '16px'
              searchYears.style.color = 'darkgray'
              searchYears.style.backgroundColor = 'transparent'
  
              searchui.appendChild(searchYears)
  
              searchList.addEventListener('click', function(_){
                const id = searchYears.id.slice(10)
                drawUI(eventTitles[id],eventHeader[id],eventDescription[id],eventYears[id], eventLat[id], eventLng[id])
              })
            }

            const nextBtn = document.createElement('button')
            nextBtn.id = 'nextBtn' + index
            nextBtn.textContent = '>'
            nextBtn.disabled = (index + 10 > eventTitleCount)
            nextBtn.style.color = nextBtn.disabled ? 'gray' : 'white'
            nextBtn.style.position = 'absolute'
            nextBtn.style.width = '15px'
            nextBtn.style.height = '15px'
            nextBtn.style.fontSize = '16px'
            nextBtn.style.fontWeight = 'bold'
            nextBtn.style.bottom = '20px'
            nextBtn.style.right = '20px'
            nextBtn.addEventListener('click', function(_) {
              deleteSearchList()
              index += 10
              display10()
            })
            searchui.appendChild(nextBtn)

            const prevBtn = document.createElement('button')
            prevBtn.id = 'prevBtn' + index
            prevBtn.textContent = '<'
            prevBtn.disabled = (index === 0)
            prevBtn.style.color = prevBtn.disabled ? 'gray' : 'white'
            prevBtn.style.position = 'absolute'
            prevBtn.style.width = '15px'
            prevBtn.style.height = '15px'
            prevBtn.style.fontSize = '16px'
            prevBtn.style.fontWeight = 'bold'
            prevBtn.style.bottom = '20px'
            prevBtn.style.right = '40px'
            prevBtn.addEventListener('click', function(_) {
              deleteSearchList()
              index -= 10
              display10()
            })
            searchui.appendChild(prevBtn)

            height += originalHeight + 30
            two.height = height
            searchui.style.height = height + 'px'
          }
        } else {
          console.error('Failed to fetch text data:', xhr.status)
        }
      }
    }
    xhr.send()
    addSearchDiv = false
  }
}

document.addEventListener('DOMContentLoaded', () => {
  two = new Two({
    type: Two.Types.svg,
    width: width,
    height: height
  }).appendTo(searchui)

  two.bind('update', draw)
  two.play()

  //document.addEventListener('mousedown', mousePressed)
  // document.addEventListener('mouseup', mouseReleased)
  // document.addEventListener('mousemove', mouseMoved)

  const svgElement = searchui.querySelector('svg');
  if (svgElement) {
    svgElement.style.pointerEvents = 'none';
  }
})

gsap.set(searchui, {
  x: divX,
  y: divY
})

function drawUI (title, header, description, year, lat, lng) {
  
  drawUIon = true
  
  let searchWindowDiv = document.createElement('div')
  searchWindowDiv.style.position = 'absolute'
  searchWindowDiv.style.width = windowWidth + "px"
  searchWindowDiv.style.top = '100px'
  searchWindowDiv.style.left = '15px'
  searchWindowDiv.style.height = windowHeight + "px"
  searchWindowDiv.style.fontFamily = "arial"
  searchWindowDiv.style.visibility = "visible"
  searchWindowDiv.style.backgroundColor = 'rgb(0,0,0,0.8)'
  searchWindowDiv.style.overflow = 'hidden'
  searchWindowDiv.style.border = '1px solid white'
  searchWindowDiv.style.borderRadius = '12px'

  document.body.appendChild(searchWindowDiv)

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

  searchWindowDiv.appendChild(windowMove)

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
  searchWindowDiv.appendChild(windowDel)

  windowDel.addEventListener('click', function(){
    deletePin()
    searchWindowDiv.remove()
  })

  const windowTitle = document.createElement('text')
  windowTitle.id = 'windowTitle'
  windowTitle.textContent = title
  windowTitle.style.position = 'absolute'
  windowTitle.style.left = textPadding
  windowTitle.style.top = '30px'
  windowTitle.style.fontSize = '24px'
  windowTitle.style.maxHeight = '20px'
  windowTitle.style.letterSpacing = '0px'
  windowTitle.style.fontWeight = 'bold'
  windowTitle.style.fontFamily = 'Arial'
  windowTitle.style.color = 'white'
  windowTitle.style.width = '200px'
  windowTitle.style.backgroundColor = 'transparent'
  windowTitle.style.outline = 'none'

  searchWindowDiv.appendChild(windowTitle)

  const windowHeader = document.createElement('text')
  windowHeader.id = 'windowHeader'
  windowHeader.textContent = header
  windowHeader.style.position = 'absolute'
  windowHeader.style.top = '110px'
  windowHeader.style.fontSize = '18px'
  windowHeader.style.left = textPadding
  windowHeader.style.width = '350px'
  windowHeader.style.height = '25px'
  windowHeader.style.fontFamily = 'Arial'
  windowHeader.style.letterSpacing = '0px'
  windowHeader.style.color = 'white'
  windowHeader.style.fontWeight = 'bold'
  windowHeader.style.backgroundColor = 'transparent'
  windowHeader.style.outline = 'none'

  searchWindowDiv.appendChild(windowHeader)

  const windowDescription = document.createElement('text')
  windowDescription.id = 'windowDescription'
  windowDescription.textContent = description
  windowDescription.style.position = 'absolute'
  windowDescription.style.top = '150px'
  windowDescription.style.left = textPadding
  windowDescription.style.fontSize = '12px'
  windowDescription.style.width = '350px'
  windowDescription.style.height = windowHeight/3 + 'px'
  windowDescription.style.outline = 'none'
  windowDescription.style.fontFamily = 'Arial'
  windowDescription.style.letterSpacing = '1px'
  windowDescription.style.color = 'white'
  windowDescription.style.backgroundColor = 'transparent'
  windowDescription.style.resize = 'none'; // Optional, to prevent resizing

  searchWindowDiv.appendChild(windowDescription)

  const windowYear = document.createElement('text')
  windowYear.id = 'windowYear'
  windowYear.textContent = year
  windowYear.style.position = 'absolute'
  windowYear.style.fontSize = '18px'
  windowYear.style.top = '25px'
  windowYear.style.right = '50px'
  windowYear.style.width = '110px'
  windowYear.style.height = '30px'
  windowYear.style.fontWeight = 'bold'
  windowYear.style.paddingTop = '2px'
  windowYear.style.textAlign = 'center'
  windowYear.style.color = 'white'
  windowYear.style.backgroundColor
  windowYear.style.borderRadius = '20px'
  windowYear.style.border = '1.2px solid white'

  searchWindowDiv.appendChild(windowYear)

  const latitude = parseFloat(lat.replace(/LAT: /g,''))
  const longitude = parseFloat(lng.replace(/LNG: /g,''))
  createPinFromCoords(latitude, longitude)
}

//export {withinSearchWindowBounds, searchWindowMD}