import './tailwind.css'
import gsap from 'gsap'
import Two from 'https://cdn.skypack.dev/two.js@latest'

let two

const searchui = document.querySelector('#search')

let divX, divY
let width, height
var searchClick = false

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

// textInput.addEventListener('click', function(_) {
//   searchClick = true
//   //console.log(searchClick)
// })

searchui.addEventListener('click', function(event) {
  if (event.target !== textInput) {
    textInput.focus();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  two = new Two({
    type: Two.Types.svg,
    width: width,
    height: height
  }).appendTo(searchui)

  // two.bind('update', draw)
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

// function draw() {
//   two.clear()
  
// }