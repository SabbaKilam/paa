/*global L*/
/*global m*/
/*global v*/
/*global c*/

//====================| HELPER methods |=========================//

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
}
//============| END of INITIALIZE |================//
c.noWiggle = function(){
  if(m.moveCount > 1 && m.moved){
    m.eventObject.preventDefault()
  }
}

//====================================//
c.logOut = function(){
  const ajax = new XMLHttpRequest();
  ajax.open(`POST`, `php/killSession.php`)
  ajax.send();
  //----------------//
  ajax.onload = function(){
    if(ajax.status !== 200){
      alert(`Trouble logging out.`)
    }
    else{
      v.passwordWall.styles(`visibility: visible`)
      v.shroud.styles(`visibility: visible`)
      v.shroud.styles(`opacity: 1`)
    }
  }
  ajax.onerror = function(){
    alert(`Trouble connecting to the server.`)
  }
}

c.restorePriorModel = function(eventObject){
  if(window.localStorage && window.localStorage.getItem('m')){
    m = JSON.parse(window.localStorage.getItem('m'))// Use it, then ...
    window.localStorage.removeItem('m') // ... lose it.
    //console.log('locally stored m:', window.localStorage.getItem('m'))
  }  
  Object.keys(m.modelMethodQualifiers).forEach(methodName =>{
    m.isOnline = window.navigator.onLine  
    let prefix = methodName.slice(0,3)
    let newMethodName = 'show' + methodName.slice(3)    
    if(prefix === 'set' && typeof c[newMethodName] === 'function'){
      c[newMethodName]()
    }    
  })
  
  if(m.shroudIsVisible){
    v.shroud.styles('visibility: visible')('opacity: 1')
  }
  if(m.popupIsVisible){
    v.popupHolder.styles('visibility: visible')('opacity: 0.85')    
  }
  m.isOnline = window.navigator.onLine;
}

//======================================//
c.updateLocalStorage = function(){  
  if(window.localStorage){
    setTimeout(function(){
      let modelAsString=''
      try{
         modelAsString = JSON.stringify(m)        
      }
      catch(e){console.log(e)}

      window.localStorage.setItem('m', modelAsString)      
      //console.log('\n\n\n')
      //console.log(window.localStorage.getItem('m'))      
    },100)
  }  
}

//===============================
c.validatePassword = function(){
  m.accessLevel === 'high' || m.accessLevel === 'low' ? c.bringDownWall() : false
}

c.bringDownWall = function(){
  v.passwordWall.styles('visibility: hidden')
  v.shroud.styles('visibility: hidden')
}

//===============
c.showAccessLevel = function(){
  const getter = new XMLHttpRequest()
  getter.open('GET', 'php/getAccessLevel.php' )
  getter.send()
  //------------//
  getter.onload = ()=> alert(getter.response)
  getter.onerror = ()=> alert("Trouble connecting to server.")
  /*
  window.fetch('php/getAccessLevel.php')
    .then(response => response.text() )
    .then(text => alert(text))
    .catch( error => alert(error))
  */
}

c.makeTitleArc = function(string, target, angle = 5){
  // 0.) wipeout existing holder
  // 1.) create a holder
  // 2.) break string into an array and establish starting angle (see 10. below)
  // 3.) make a box for each character putting it in an array...
  // 4.) place charcter in box and ...
  // 5.) append the box to the holder
  // 6.) place the holder as first child of target
  // 7.) place boxes in front of each other in ulc of holder
  // 8.) lengthen each box to double the length of target (arbitrarily long)
  // 9.) put transform-origin at bottom of each box
  //10.) rotateY each box by increments of the supplied angle (or 5 degrees)
  //     starting at a negative angle that is 1/2 total spread angle
  
  // 0.) 
  target.innerHTML = ''
  
  // 1.)
  const holder = document.createElement('div')

  holder.styles = L.styles.bind(holder) 
  holder
    .styles
      ('margin-top: 0.125rem')
      ('margin-left: 49%')
      ('z-index: -3')  

  // 2.)
  const charArray = string.split('')
  const charCount = charArray.length
  const fullAngle = angle * charCount
  m.startingAngle = -(fullAngle / 2) //negative starting angle
  m.currentAngle = m.startingAngle - angle/1.5 // angle => a littlemore counterclockwise
  
  // 3. 4. & 5.)
  const boxesArray = []
  charArray.forEach(character => {
    const box = document.createElement('div')
    boxesArray.push(box)
    box.setAttribute('class', 'box')
    box.style.fontFamily = 'monospace'
    box.style.fontSize = '2.12rem'
    box.style.fontWeight = 'bold'
    //box.style.textShadow = '0 2px 1px hsl(240, 45%, 15%)'
    box.style.color = 'hsl(234, 54%, 40%)'/*"hsl(50, 100%, 45%)"*/
    box.innerText = character
    holder.appendChild(box)
  })
  
  // 6.)
  target.appendChild(holder)
  
  // 7. & 8.)
  boxesArray.forEach( box => {
    box.style.position = 'absolute'
    box.style.height = '900px'
    //box.style.border = '1px solid lightgray'//delete this later    
  })
  
  // 9. & 10.)
  boxesArray.forEach((box, index) =>{
    box.style.transformOrigin = 'bottom'
    m.currentAngle += angle
    box.style.transform = `rotateZ(${m.currentAngle}deg`
  })
}
//---------