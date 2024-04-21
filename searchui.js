import './tailwind.css'
import gsap from 'gsap'
import Two from 'https://cdn.skypack.dev/two.js@latest'

let two

const searchui = document.querySelector('#search')

let divX, divY
let width, height
var searchClick = false
let addSearchDiv = false

divX = 15; divY = 15;
width = 480; height = 35;

searchui.style.width = width + "px"
searchui.style.lineHeight = height + "px"
searchui.style.textAlign = "center"
searchui.style.verticalAlign = "middle"
searchui.style.fontSize = "36px"
searchui.style.fontFamily = "Arial"
searchui.style.backgroundColor = 'transparent'
searchui.style.outline = '1.2px solid white'

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
    searchClick = true;
    addSearchDiv = true
    textInput.focus();
  } else if (event.target === textInput) {
    searchClick = true;
    addSearchDiv = true
  } else {
    searchClick = false;
    addSearchDiv = false
  }
});

const draw = () => {
  if (!searchClick) {
    two.clear()
  }
  if (addSearchDiv) {
    console.log('search is active')
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/readFile');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const textData = xhr.responseText;
          console.log('textData', textData)
          // Create text using the fetched data
          let text = two.makeText(textData);
          text.fill = 'white';
          text.family = 'Spline Sans Mono,sans-serif';
          // Position the text as needed
          text.translation.set(50, 20);
          // Add more styling or positioning as needed
        } else {
          console.error('Failed to fetch text data:', xhr.status);
        }
      }
    };
    xhr.send();
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
