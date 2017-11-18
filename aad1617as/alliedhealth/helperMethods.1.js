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
  
  c.adjustAccess()
  //c.restorePriorModel(eventObject)  

  setTimeout(c.showShroudHidden, 500)
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
  
  //c.attachFolderShadow()
  c.showResize()
  
  //for the model's state variable mutations not caused by events:
  
  setInterval(function(){
    c.updateView();
    c.showResize()    
  }, 16.66667) // ~ 60 frames/second  
  
  //the initial model update
  c.updateModel(eventObject)
}
//============| END of INITIALIZE |================//
c.adjustAccess = function(){
  const checker = new XMLHttpRequest()
  checker.open(`POST`, `../../php/getAccessLevel.php`)
  checker.send();
  //--------| helper |-----------//
  checker.onload = function(){
    if(checker.response !== 'high' && checker.response !== 'low'){
      document.location.assign(`../../`)
    }else if(checker.response === 'low'){
      //hide upload and delete
      v.fileFrame.styles(`visibility: hidden`)
      v.btnDeleteFile.styles(`visibility: hidden`)
      
      //move select window up into a the space
      v.documentFrame.styles(`bottom: 30%`)
      //v.fileControls.styles(`top: 10%`)
      v.outerFileFrame.styles(`height: 65%`)
      v.outerFileFrame.styles(`top: 54%`)
    }
  }
  checker.onerror = function(){
    alert(`Trouble connecting to the server.`)
    document.location.assign(`../../`)
  }
}
//----------------------------------------------------//
c.attachFolderShadow = function(){
  const shadowTop = v.folderFrame.getBoundingClientRect().bottom
  v.folderShadow.styles
    (`top: ${shadowTop}px`)
    (`text-align: center`)
}
//----------------------------------------------------//
c.noWiggle = function(){
  if(m.moveCount > 1 && m.moved){
    m.eventObject.preventDefault()
  }
}

//====================================//
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

//==================================================//
c.showProgress = function(loaded, total, index){
  v.spinner.styles(`visibility: hidden`)
  const numberOfFiles = v.fileElement.files.length
  m.fractionArray[index] = loaded/total
  m.averageUploadFraction = m.fractionArray.reduce(function(sum, value){
      return sum + value/numberOfFiles
  }, 0)
  const pct = Math.round(100 * m.averageUploadFraction)
  const adjustedWidth = pct * 0.9875
  v.pctUpload.innerText = `${pct}%`
  v.bead.styles(`width: ${adjustedWidth}%`)
  if(pct === 100){
    setTimeout(function(){
        m.uploading = false
        v.pctUpload.innerText =``
        v.bead.styles(`width: 0`)              
        m.fractionArray = []
        m.averageUploadFraction = 0
        v.uploadAssembly.styles(`visibility: hidden`)              
    }, 3000)
  }        
}
//----------------------------------------------------//
c.openFolder = function(){
  v.folderFront.styles('transform: rotateX(-180deg)')
  v.folderTitle.styles('transform: rotateX(-180deg)')
  if(m.uploading){
    v.uploadAssembly.styles(`visibility: visible`)
  }
  v.uploadAssembly.styles(`transform: rotateX(-180deg)`)(`transition: all 0.65s ease`)
  v.folderShadow.styles
    (`transition: all 1s ease`)
    (`transform: rotateX(0deg)`)
  setTimeout(function(){
      v.folderShadow.styles(`transition: all 0s ease`)
  }, 1000)    
}
//----------------------------------------------------//
c.closeFolder = function(){
  v.folderFront.styles('transform: rotateX(-30deg)')
  v.folderTitle.styles('transform: rotateX(-30deg)')
  v.uploadAssembly.styles(`transform: rotateX(-300deg)`)(`visibility: hidden`)(`transition: all 0.2s ease`)  
  v.folderShadow.styles
    (`transition: all 1s ease`)
    (`transform: rotateX(87deg)`)    
  setTimeout(function(){
      v.folderShadow.styles(`transition: all 0s ease`)
  }, 1000)  
}

