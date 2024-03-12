import { resizeGlobe } from "./globe.js"
import { resizeTargetYear } from "./targetYear.js"
import { resizeLocationPin } from "./locationToggle.js"
import { resizePinWindow } from "./pinWindow.js"

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('resize', resize)
  window.onresize = resize
})

function resize(_) {
  resizeGlobe()
  resizeTargetYear()
  resizeLocationPin()
  resizePinWindow()
}