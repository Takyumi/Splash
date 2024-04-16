import './tailwind.css'
import gsap from 'gsap'
import * as THREE from 'three'
import countries from './countries.json'
import vertexShader from "./shaders/vertex.glsl"
import fragmentShader from "./shaders/fragment.glsl"
import coneVertexShader from "./shaders/coneVertex.glsl"
import coneFragmentShader from "./shaders/coneFragment.glsl"
import { resetLocationPin } from './locationToggle'
import { createPinWindowDiv, deletePinWindowDiv } from './pinWindow'

const globeContainer = document.querySelector('#globeContainer')
globeContainer.onwheel = zoom

function zoom(event) {
  event.preventDefault()
  camera.position.z -= event.deltaY * -0.005
  if (camera.position.z < 5.6) {
    camera.position.z = 5.6
  } else if (camera.position.z > 20) {
    camera.position.z = 20
  }
}

const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xeeeee4 )
let camera = new THREE.PerspectiveCamera(75,globeContainer.offsetWidth / globeContainer.offsetHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer(
  {
  antialias: true,
  canvas: document.querySelector('#globeCanvas')
})

renderer.setSize(globeContainer.offsetWidth, globeContainer.offsetHeight)
renderer.setPixelRatio(window.devicePixelRatio)

//create a sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        globeTexture: {
          value: new THREE.TextureLoader().load('./image/globe-highRes-white.png')
      }
    }
  })
)

let pin = undefined

const group = new THREE.Group()
group.add(sphere)
scene.add(group)

let centerPoint = new THREE.Mesh(
  new THREE.SphereGeometry(1, 24, 12),
  new THREE.MeshBasicMaterial({
    color: 0xffff00
  })
)
centerPoint.position.set(0, 0, 0);
group.add(centerPoint)

const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff
})

const starVertices = []
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000
  const y = (Math.random() - 0.5) * 2000 
  const z = -Math.random() * 3000
  starVertices.push(x, y, z)
}

starGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(
    starVertices, 3)
)

const stars = new THREE.Points(starGeometry, starMaterial)
scene.add(stars)

camera.position.z = 12

function createBoxes(countries) {
  countries.forEach((country) => {

    const scale = country.population / 1000000000
    const lat = country.latlng[0]
    const lng = country.latlng[1]
    const zScale = 0.8 * scale

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(
        Math.max(0.1, 0.2 * scale), 
        Math.max(0.1, 0.2 * scale), 
        Math.max(zScale, 0.4 * Math.random())),
      new THREE.MeshBasicMaterial({
        color: '#FF9EFD',
        opacity: 0.4,
        transparent: true
      })
    )

    //23.6345° N, 102.5528° W = mexico
    //West = negative, East = Positive
    const latitude = (lat / 180) * Math.PI //converts degrees to radian since js sin/cos/tan can only take in radians
    const longitude = (lng / 180) * Math.PI + Math.PI / 2
    const radius = 5

    const x = radius * Math.cos(latitude) * Math.sin(longitude)
    const y = radius * Math.sin(latitude)
    const z = radius * Math.cos(latitude) * Math.cos(longitude)

    box.position.x = x
    box.position.y = y
    box.position.z = z

    box.lookAt(0, 0, 0)
    box.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -zScale/2))

    group.add(box)

    gsap.to(box.scale, {
      z: 1.4,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'linear',
      delay: Math.random()
    })

    box.country = country.name.common
    box.population = new Intl.NumberFormat().format(country.population)
  })
}

createBoxes(countries)

group.rotation.offset = {
  x: 0,
  y: 0
}

const mouse = {
  x: undefined,
  y: undefined,
  down: false,
  xPrev: undefined,
  yPrev: undefined
}

const raycaster = new THREE.Raycaster()
const popUpEl = document.querySelector('#popUpEl')
const populationEl = document.querySelector('#populationEl')
const populationValueEl = document.querySelector('#populationValueEl')

let scaleFactor = 8
let scaleVector = new THREE.Vector3()

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)

  //update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera)
  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(group.children.filter(mesh => {
  return mesh.geometry.type === 'BoxGeometry'
  }))

  group.children.forEach(mesh => {
    mesh.material.opacity = 0.4
  })

  gsap.set(popUpEl, {
    display: 'none'
  })

  //^if not hovered v if hovered

  for (let i = 0; i < intersects.length; i++) {
    const box = intersects[i].object
    box.material.opacity = 1
    gsap.set(popUpEl, {
      display: 'block'
    })

    populationEl.innerHTML = box.country
    populationValueEl.innerHTML = box.population
  }

  if (pin) {
    let scale = scaleVector.subVectors(pin.position, camera.position).length() / scaleFactor
    pin.scale.set(scale, scale, scale)
  }

  renderer.render(scene, camera)
}
animate()

let pinDrag = false

function getMouseSpherePos(intersects) {
  let pos = new THREE.Vector3();
  sphere.worldToLocal(pos.copy(intersects[0].point))

  let spherical = new THREE.Spherical()
  spherical.setFromVector3(pos)

  const latitude = Math.PI / 2 - spherical.phi
  const longitude = spherical.theta
  const radius = 5.25

  const x = radius * Math.cos(latitude) * Math.sin(longitude)
  const y = radius * Math.sin(latitude)
  const z = radius * Math.cos(latitude) * Math.cos(longitude)

  globalThis.pinLatitude = 180 * latitude / Math.PI
  globalThis.pinLongitude = 180 * (longitude - Math.PI / 2) / Math.PI
  
  return new THREE.Vector3(x, y, z)
}

globeContainer.addEventListener('mousedown', ({clientX, clientY}) => {
  if (inPin()) {
    pinDrag = true
  } else {
    mouse.down = true
  }
  mouse.xPrev = clientX,
  mouse.yPrev = clientY
})

addEventListener('mousemove', (event) => {
  if (innerWidth >= 1280) {
    mouse.x = ((event.clientX) / (innerWidth)) * 2 - 1
    mouse.y = -(event.clientY / (innerHeight * 4/5)) * 2 + 1
  } else {
    const offset = globeContainer.getBoundingClientRect().top
    mouse.x = (event.clientX / innerWidth) * 2 - 1
    mouse.y = -((event.clientY - offset) / (innerHeight * 4/5)) * 2 + 1
  }

  gsap.set(popUpEl, {
    x: event.clientX,
    y: event.clientY
  })

  if (pinDrag) {
    const intersects = raycaster.intersectObject(sphere)
    if (intersects.length > 0) {
      pin.position.copy(getMouseSpherePos(intersects))
      pin.lookAt(centerPoint.position)
    }
  }

  if (mouse.down) {
    event.preventDefault()

    const deltaX = event.clientX - mouse.xPrev
    const deltaY = event.clientY - mouse.yPrev

    group.rotation.offset.x += deltaY * 0.005
    group.rotation.offset.y += deltaX * 0.005

    gsap.to(group.rotation, {
      y: group.rotation.offset.y,
      x: group.rotation.offset.x
    })
    mouse.xPrev = event.clientX
    mouse.yPrev = event.clientY
  }
})

let pinWindowId = undefined

addEventListener('mouseup', (event) => {
  mouse.down = false
  pinDrag = false

  if (globalThis.addPin) {
    createPin(event)
    pinWindowId = createPinWindowDiv()
  } else if (inPin()) {
    group.remove(pin)
    pin = undefined
    resetLocationPin()
    deletePinWindowDiv(pinWindowId)
    pinWindowId = undefined
  }
})

function createPin(event) {
  const offset = globeContainer.getBoundingClientRect().top
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -((event.clientY - offset) / innerHeight) * 2 + 1

  const intersects = raycaster.intersectObject(sphere)
  if (intersects.length > 0) {
    pin = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 0.5, 6, 1, false, 0.5), 
      new THREE.ShaderMaterial({
        vertexShader: coneVertexShader,
        fragmentShader: coneFragmentShader
      })
    )

    pin.position.copy(getMouseSpherePos(intersects))
    pin.geometry.rotateX( Math.PI / 2 )
    pin.lookAt(centerPoint.position)
    group.add(pin)
    globalThis.addPin = false
  }
}

function resizeGlobe(_) {
  renderer.setSize(globeContainer.offsetWidth, globeContainer.offsetHeight)
  camera = new THREE.PerspectiveCamera(75,globeContainer.offsetWidth / globeContainer.offsetHeight, 0.1, 1000)
  camera.position.z = 12
}

function inGlobe() {
  return raycaster.intersectObject(sphere).length > 0
}

function inPin() {
  return pin ? raycaster.intersectObject(pin).length > 0 : false
}

export { inGlobe, resizeGlobe }

addEventListener('touchmove', (event) => {
  event.clientX = event.touches[0].clientX
  event.clientY = event.touches[0].clientY
  
  const doesIntersect = raycaster.intersectObject(sphere)
  
  if (doesIntersect.length > 0) mouse.down = true

  if (mouse.down) {
    const offset = globeContainer.getBoundingClientRect().top
    mouse.x = (event.clientX / innerWidth) * 2 - 1
    mouse.y = -((event.clientY - offset) / innerHeight) * 2 + 1

    gsap.set(popUpEl, {
      x: event.clientX,
      y: event.clientY
    })

    event.preventDefault()

    const deltaX = event.clientX - mouse.xPrev
    const deltaY = event.clientY - mouse.yPrev

    group.rotation.offset.x += deltaY * 0.005
    group.rotation.offset.y += deltaX * 0.005

    gsap.to(group.rotation, {
      y: group.rotation.offset.y,
      x: group.rotation.offset.x
    })
    mouse.xPrev = event.clientX
    mouse.yPrev = event.clientY

  }

},{passive:false})

addEventListener('touchend', (event) => {
  mouse.down = false
})