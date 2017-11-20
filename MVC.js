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

//specialized states (these vary per application)

m.isPortrait = window.innerHeight >= window.innerWidth
m.currentAngle = -45
m.titleCharacters = 'PIT Academic Assessment'
m.accessLevel = 'deny'
m.innerWidth = window.innerWidth;

//---------------------//
m.baseUrl = `https://academic-assessment-sabbakilam1.c9users.io/`
m.averageUploadFraction = 0
m.fractionArray = []
m.filesToUpload = []
m.folderIsOpen = false
m.uploadPath =`../aad1617as/businessmanagement/uploads/`
m.localUploadPath = `aad1617as/businessmanagement/uploads/`
m.folderTitle = `Business Management`
m.scriptPath = `php/uploadFile.php`
m.uploading = false

m.folderBackImage = 'images/folderBack.png'
m.folderFrontImage = 'images/folderFront.png'
m.MAX_WIDTH = 400

//===========| UPDATE MODEL |===========//
c.updateModel = function(eventObject){
  c.updateBasicStates(eventObject)
  m.modelMethodQualifiers = {
    setToggleFolder:        [m.source === v.folderFront || m.source === v.folderTitle, m.clicked],      
    setCheckPassword:       [m.type === 'keyup'],    
    setShroudHidden:        [v.btnHideShroud === m.source, m.clicked],
    setOfflineStatus:       [m.type === 'online' || m.type === 'offline'],
    setResize:              [m.resized],
    showAccessLevel:        [m.source === v.main, m.clicked],
    setUploadFiles:         [m.source === v.fileElement, m.type === 'change'],
    deleteFile:             [m.source === v.btnDeleteFile, m.clicked],
    hideDocumentViewer:     [m.source === v.exitViewer, m.clicked],
    displayDocument:        [m.source === v.btnDisplayDocument, m.clicked],
    showDocument:           [m.source === v.documentSelector, m.type === 'change'],
  }
  L.runQualifiedMethods(m.modelMethodQualifiers, c, c.updateView)
}

//=============| UPDATE VIEW |==============//
c.updateView = function(){
  const viewMethodQualifiers = {
    showEvents: [true],
    noWiggle: [m.moved], //iOS background wiggle 
    logOut:   [m.source === v.logoutGlass, m.clicked]
  }
  L.runQualifiedMethods(viewMethodQualifiers, c, "no callback needed here")
}
//===========| END of UPDATE VIEW |===========//

//============| INITIALIZE |================//
c.initialize = function(eventObject){
  
  //attach "id"-ed elements to our view object (after giving window its own id)
  window.id = 'window'
  L.attachAllElementsById(v)
  
  c.restorePriorModel(eventObject)
  c.makeTitleArc(m.titleCharacters, v.fanHolder, 1.5)
  v.txtPassword.focus();
  
  //for apple devices
  L.noPinchZoom()
 
  //list of event types of interest
  m.eventTypes = [
    'change',
    'DOMContentLoaded',
    'load',
    'mousedown',
    'touchstart',
    'mouseup',
    'touchend',
    'mousemove',
    'touchmove',
    'resize',
    'orientationchange',
    'keyup',
    'keydown',
    'online',
    'offline',
    'dblclick'
  ]
  //make the window object listen to, and handle all event types of interest
  m.eventTypes.forEach(eventType =>{
    window.addEventListener(eventType, c.updateModel, true )
  })
  
  //for the model's state variable mutations not caused by events:
  setInterval(function(){
    c.updateView();
  }, 16.66667) // ~ 60 frames/second  
  
  v.txtPassword.focus();
  //the initial model update
  c.updateModel(eventObject)
  
  c.getFileList()
  
  m.baseUrl = `https://academic-assessment-sabbakilam1.c9users.io/`  
  m.uploadPath =`../aad1617as/alliedhealth/uploads/`
  m.localUploadPath = `aad1617as/alliedhealth/uploads/`
  m.folderTitle = `Allied Health`
  //m.uploadPath =`../aad1617as/businessmanagement/uploads/`
  //m.folderTitle = `Business  Management`
  
  v.folderTitle.innerText = m.folderTitle  
}
//============| END of INITIALIZE |================//