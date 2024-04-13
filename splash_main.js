import { resizeGlobe } from "./globe.js"
import { withinTimelineBounds, timelineMD, timelineMU, timelineMM } from "./timeline.js"
import { withinTargetYearBounds, resizeTargetYear, targetYearMD, targetYearMU, targetYearMM } from "./targetYear.js"
import { withinLocationPinBounds, resizeLocationPin, locationToggleMD, locationToggleMU, locationToggleMM } from "./locationToggle.js"
import { withinPinWindowBounds, resizePinWindow, pinWindowMD, pinWindowMU, pinWindowMM } from "./pinWindow.js"

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('mousedown', mouseDown)
  document.addEventListener('mouseup', mouseUp)
  document.addEventListener('mousemove', mouseMove)
  document.addEventListener('resize', resize)
  window.onresize = resize
})

function mouseDown(event) {
  let mouseX = event.clientX
  let mouseY = event.clientY
  
  if (withinTargetYearBounds(mouseX, mouseY)) targetYearMD(event)
  else if (withinPinWindowBounds(mouseX, mouseY)) pinWindowMD(event)
  else if (withinLocationPinBounds(mouseX, mouseY)) locationToggleMD(event)
  else if (withinTimelineBounds(mouseY)) timelineMD(event)
}

function mouseUp(event) {
  targetYearMU(event)
  pinWindowMU(event)
  locationToggleMU(event)
  timelineMU(event)
}

function mouseMove(event) {
  pinWindowMM(event)
  targetYearMM(event)
  locationToggleMM(event)
  timelineMM(event)
}

function resize(_) {
  resizeGlobe()
  resizeTargetYear()
  resizeLocationPin()
  resizePinWindow()
}
