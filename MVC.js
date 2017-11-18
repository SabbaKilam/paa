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

//===========| UPDATE MODEL |===========//
c.updateModel = function(eventObject){
  c.updateBasicStates(eventObject)
  m.modelMethodQualifiers = {
    setCheckPassword:       [m.type === 'keyup'],    
    setShroudHidden:        [v.btnHideShroud === m.source, m.clicked],
    setOfflineStatus:       [m.type === 'online' || m.type === 'offline'],
    setResize:              [m.resized],
    showAccessLevel:        [m.source === v.main, m.clicked],
  }
  L.runQualifiedMethods(m.modelMethodQualifiers, c, c.updateView)
}

//===========| UPDATE VIEW |===========//
c.updateView = function(){
  const viewMethodQualifiers = {
    showEvents: [true],
    noWiggle: [m.moved], //iOS background wiggle 
    logOut:   [m.source === v.logoutGlass, m.clicked]
  }
  L.runQualifiedMethods(viewMethodQualifiers, c, "no callback needed here")
}


