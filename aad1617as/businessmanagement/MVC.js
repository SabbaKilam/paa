/*global L*/
//===========| CREATE MODEL, VIEW and CONTROLLER objects |========//
let m = {} // using let, not const to allow reassignment of locally stored prior value
const v = {}
const c = {}

//====| MODEL DATA |===========//
//basic states: meta events
m.eventTypes = [] //list of events that we "listen for" in this app (see c.initialize)
m.eventObjects = [{type: "no_prior_event"}, {type: "no_prior_event"}, {type: "no_prior_event"}]
m.eventObject = {type: "no_prior_event"}
m.type = ''
m.source = {}
m.id = ''

m.startTime = 0
m.priorStartTime = 0
m.elapsedTimes = [0, 0, 0]

m.pressed = false
m.priorPressed = [false, false, false]

m.released = false
m.priorReleased = [false, false, false]

m.moved = false
m.priorMoved = [false, false, false]

m.clicked = false
m.resized = false

m.isOnline = true
m.shroudIsVisible = false
m.popupIsVisible = false
m.moveCount = 0

m.debounceTimeMin = 25 //in milliseconds
m.debounceTimeMax = 750 // milliseconds

m.modelMethodQualifiers = {}

//=======| specialized states (these vary per application) |========//
m.averageUploadFraction = 0
m.fractionArray = []
m.filesToUpload = []
m.folderIsOpen = false
m.uploadPath =`../aad1617as/businessmanagement/uploads/`
m.scriptPath = `../../php/uploadFile.php`
m.uploading = false

m.folderBackImage = 'images/folderBack.png'
m.folderFrontImage = 'images/folderFront.png'
m.innerWidth = window.innerWidth
m.MAX_WIDTH = 400

//===========| UPDATE MODEL |===========//
c.updateModel = function(eventObject){
  c.updateBasicStates(eventObject)
  m.modelMethodQualifiers = {
    setToggleFolder:           [m.source === v.folderFront || m.source === v.folderTitle, m.clicked],  
    setShroudHidden:           [v.btnHideShroud === m.source, m.clicked],
    setOfflineStatus:          [m.type === 'online' || m.type === 'offline'],
    setResize:                 [m.resized],
    setUploadFiles:            [m.source === v.fileElement, m.type === 'change']
  }
  L.runQualifiedMethods(m.modelMethodQualifiers, c, c.updateView)
}

//===========| UPDATE VIEW |===========//
c.updateView = function(){
  const viewMethodQualifiers = {
    showEvents: [true],
    noWiggle: [m.moved], //iOS background wiggle
  }
  L.runQualifiedMethods(viewMethodQualifiers, c, "no callback needed here")
}


