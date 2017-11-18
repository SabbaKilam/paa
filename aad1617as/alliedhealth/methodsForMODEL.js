/*global L*/
/*global m*/
/*global v*/
/*global c*/

//===| functions that UPDATE MODEL |========//
//---------| Update basic states |----------//
c.updateBasicStates = function(eventObject){
  
  m.priorStartTime = m.startTime
  m.startTime = Date.now()
  
  m.elapsedTimes.unshift(m.startTime - m.priorStartTime)
  m.elapsedTimes.pop()
  
    
  m.eventObjects.unshift(m.eventObject)
  m.eventObjects.pop()
  m.eventObject = eventObject  

  m.type = eventObject.type
  m.source = eventObject.target
  m.id = m.source.id
  
  m.priorPressed.unshift(m.pressed)
  m.priorPressed.pop()  
  m.pressed = (m.type === 'mousedown' || m.type === 'touchstart')
  
  m.priorReleased.unshift(m.pressed)
  m.priorReleased.pop()   
  m.released = (m.type === 'mouseup'  || m.type === 'touchend') 
  
  m.priorMoved.unshift(m.moved)
  m.priorMoved.pop()
  m.moved = (m.type === 'mousemove' || m.type === 'touchmove')
  
  m.moveCount = m.moved ? ++m.moveCount : 0
  
  m.innerWidth = window.innerWidth
  
  m.clicked = clicked()
  //------| helper(s) |--------//
  function clicked(){
    return m.released &&
      (m.priorPressed[0] || m.priorMoved[0]) &&
      (m.elapsedTimes[0] > m.debounceTimeMin) &&
      (m.elapsedTimes[0] < m.debounceTimeMax)
  }
  //-------------------------------//
  m.resized = m.type === 'resize'             ||
              m.type === 'orientationchange'  ||
              m.type === 'load'               ||
              m.type === 'DOMContentLoaded'
  
  //save the updated model in localStorage  
  //c.updateLocalStorage()  
}
//---------| END Update basic states |----------//
c.setUploadFiles = function(){
  if(!v.fileElement.files[0]){return}
  c.clearUploadData()
  const xhr = new XMLHttpRequest()
  xhr.open('POST', `../../php/getAccessLevel.php`)
  xhr.send();
  //----------------//
  xhr.onload = function(){
    if(xhr.response !== `high`){
      const message = 
      `You currently don't have permission to upload.
       Try logging out and logging in again.`
      alert(message)
      window.location.assign(`../../`)
    }
    else{
      m.uploading = true 
      v.fileElement.styles(`visibility: hidden`)
      v.spinner.styles(`visibility: visible`)
      v.uploadAssembly.styles(`visibility: visible`)
      
      //save filesToUpload
      const array = [];
      array.forEach.call(v.fileElement.files, file=>{
        m.filesToUpload.push({name: file.name, done: false})
      })
      
      array.forEach.call(v.fileElement.files, file=>{
        v.divFilenames.innerHTML += `${file.name}<br>`
      })
      
      //provide: callback, fileElement, scriptname, uploadPath
      L.uploadFiles(c.showProgress, v.fileElement, m.scriptPath, m.uploadPath)
    }
  }
}
//-------------------------------//
c.setToggleFolder = function(){
  m.folderIsOpen = !m.folderIsOpen
}

c.setShroudHidden = function (){
  m.shroudIsVisible = false
  m.popupIsVisible = false
  //c.updateLocalStorage()  
}

c.setShroudVisible = function(){
  m.shroudIsVisible = true
  //c.updateLocalStorage()  
}

c.setPopupToggle = function(){
  m.popupIsVisible = !m.popupIsVisible
  //c.updateLocalStorage()  
}

c.setOfflineStatus = function(){
  if(m.type === 'online'){
    m.isOnline = true;
  }
  else if(m.type === 'offline'){
    m.isOnline = false;
  }
  //c.updateLocalStorage()  
}

c.setResize = function(){
  m.innerWidth = window.innerWidth
  //c.updateLocalStorage()
}

c.setClearLocalStorage = function(){
  m.btnClearLocalStorageIn = !m.btnClearLocalStorageIn
  //c.updateLocalStorage()  
}

