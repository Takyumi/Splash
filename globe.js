import './tailwind.css'
import gsap from 'gsap'
import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";
import countries from './countries.json'
import vertexShader from "./shaders/vertex.glsl"
import fragmentShader from "./shaders/fragment.glsl"
import atmosphereVertexShader from "./shaders/atmosphereVertex.glsl"
import atmosphereFragmentShader from "./shaders/atmosphereFragment.glsl"

//console.log(countries)

const globeContainer = document. 
  querySelector('#globeContainer')

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xeeeee4 );
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

//create atmosphere
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  })
)

atmosphere.scale.set(1.1, 1.1, 1.1)

scene.add(atmosphere)

const group = new THREE.Group()
group.add(sphere)
scene.add(group)

const starGeometry = new THREE.
  BufferGeometry()
const starMaterial = new THREE.
  PointsMaterial({
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
    const longitude = (lng / 180) * Math.PI
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

sphere.rotation.y = -Math.PI / 2

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

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  //.rotation.y += 0.002
  //sphere.rotation.x += 0.001

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

  renderer.render(scene, camera)
}
animate()

globeContainer.addEventListener('mousedown', ({clientX, clientY}) => {
  mouse.down = true
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

addEventListener('mouseup', (event) => {
  mouse.down = false
})

addEventListener('resize', () => {
  renderer.setSize(globeContainer.offsetWidth, globeContainer.offsetHeight)
  camera = new THREE.PerspectiveCamera(75,globeContainer.offsetWidth / globeContainer.offsetHeight, 0.1, 1000)
  camera.position.z = 12
})

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