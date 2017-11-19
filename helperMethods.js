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
}
//============| END of INITIALIZE |================//
c.allowReadonlyAccess = function(){
  const file = document.querySelector(`#fileFrame`)
  const doc = document.querySelector(`#documentFrame`)
  const outer = document.querySelector(`#outerFileFrame`)
  const btn = document.querySelector(`btnDeleteFile#`)
  const control = document.querySelector(`#fileControls`)
  
  //hide upload and delete
  file.style.visibility = `hidden`
  btn.style.visibility = `hidden`
  
  //move select window up into a the space
  doc.style.bottom = `30%`
  control.style.top = `10%`
  outer.style.height = `65%`
  outer.style.top = `54%`  
}
//-----------------------------------------------//
c.allowFullAccess = function(){
  const file = document.querySelector(`#fileFrame`)
  const doc = document.querySelector(`#documentFrame`)
  const outer = document.querySelector(`#outerFileFrame`)
  const btn = document.querySelector(`#btnDeleteFile`)
  const control = document.querySelector(`#fileControls`)
  
  //show upload and delete
  file.style.visibility = `visible`
  btn.style.visibility = `visible`
  
  //restore select window
  doc.style.bottom = `20%`
  control.style.top = `70%`
  outer.style.height = `100%`
  outer.style.top = `35%`
  
}

//-----------------------------------------------//
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

//------------------------------------------------------------//
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
  if( m.accessLevel === 'low'){c.allowReadonlyAccess()}
  if( m.accessLevel === 'high'){c.allowFullAccess()}
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

/*=============================| FOLDER "IMPORTED" METHODS |==============================*/
c.adjustAccess = function(){
  const checker = new XMLHttpRequest()
  checker.open(`POST`, `php/getAccessLevel.php`)
  checker.send();
  //--------| helper |-----------//
  checker.onload = function(){
    if(checker.response !== 'high' && checker.response !== 'low'){
      c.logOut()
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
    c.logOut()
  }
}

//----------------------------------------------------//
c.attachFolderShadow = function(){
  const shadowTop = v.folderFrame.getBoundingClientRect().bottom
  v.folderShadow.styles
    (`top: ${shadowTop}px`)
    (`text-align: center`)
}

//======================================//
c.clearUploadData = function(){
  m.uploading = false
  v.pctUpload.innerText =``
  v.divFilenames.innerHTML =``
  v.bead.styles(`width: 0`)              
  m.fractionArray = []
  m.filesToUpload = []   
  m.averageUploadFraction = 0
  v.uploadAssembly.styles(`visibility: hidden`)
  v.fileElement.styles(`visibility: visible`)  
}

c.showProgress = function(loaded, total, index){
  const numberOfFiles = v.fileElement.files.length
  if(numberOfFiles === 0){return}
  if(m.fractionArray.length === numberOfFiles && m.fractionArray.every(fraction => fraction > 0.02)){//2% arbitrary
    v.spinner.styles(`visibility: hidden`)
    c.getFileList()
  }

  m.fractionArray[index] = loaded/total
  m.averageUploadFraction = m.fractionArray.reduce(function(sum, value){
      return sum + value/numberOfFiles
  }, 0)
  const pct = Math.round(100 * m.averageUploadFraction)
  const adjustedWidth = pct * 0.995
  v.pctUpload.innerText = `${pct}%`
  v.bead.styles(`width: ${adjustedWidth}%`)
  
  //determine which files still need to finish uploading:
  m.fractionArray.forEach((fraction, index)=>{
    m.filesToUpload[index].done = (fraction === 1) ? true : false
  })
  //display the pending filenames:
  v.divFilenames.innerHTML =`` // first clear the old names
  m.filesToUpload.forEach(file=>{
    !file.done ? v.divFilenames.innerHTML +=`${file.name}<br>` : false
  })
  if(pct === 100){
    setTimeout(function(){
      c.clearUploadData()
      c.getFileList()
    }, 3000)
  }        
}

//=========================================================================//
c.getFileList = function (){
    const getter = new XMLHttpRequest()
    const envelope = new FormData()
    envelope.append("uploadPath", m.uploadPath)
    getter.open('POST', 'php/getFileList.php')
    getter.send(envelope)
    getter.onload = function(){
        if(getter.status === 200){
            c.fillDocumentSelector(getter.response)
        }
        else{
            alert('Trouble getting file list.')                  
        }
    }
}

//=====================================================================//
c.allowReadonlyAccess = function(){
  //hide upload and delete
  v.fileFrame.styles(`visibility: hidden`)
  v.btnDeleteFile.styles(`visibility: hidden`)
  
  //move select window up into a the space
  v.documentFrame.styles(`bottom: 30%`)
  //v.fileControls.styles(`top: 10%`)
  v.outerFileFrame.styles(`height: 65%`)
  v.outerFileFrame.styles(`top: 54%`)  
}
//======================================================================//
c.fillDocumentSelector = function (filesString){
    const currentFilename = v.documentSelector.options[v.documentSelector.selectedIndex] && v.documentSelector.options[v.documentSelector.selectedIndex].innerText
    v.documentSelector.innerHTML = ''
    const filenameArray = filesString.split('\n')
    filenameArray.pop() // get rid of the blank last entry
    filenameArray.forEach( filename =>{
        const option = document.createElement('option')
        option.innerText = filename
        v.documentSelector.appendChild(option)
    })
    v.documentSelector.selectedIndex = filenameArray.indexOf(currentFilename)
    v.documentSelector.selectedIndex === -1 ? v.documentSelector.selectedIndex = 0 : false
}

//=====================================================================//
c.deleteFile = function(){
  const xhr = new XMLHttpRequest()
  xhr.open('POST', `php/getAccessLevel.php`)
  xhr.send();
  //----------------//
  xhr.onload = function(){
    if(xhr.status === 200 && xhr.response !== `high`){
      const message = 
      `You currently don't have permission to upload.
       Try logging out and logging in again.`
      alert(message)
      c.logOut()
    }  
    else if(xhr.status === 200 && xhr.response === `high`){
      const fileIndex = v.documentSelector.selectedIndex   
      if(!v.documentSelector.options[fileIndex]){return}
      const filename = v.documentSelector.options[fileIndex].innerText
      if(filename === `index.html`){
        alert(`Not allowed to delete the index file.`)
        return
      }
      const okayToDelete = window.confirm(`OK to DELETE ${filename}?\n(otherwise CANCEL)`)
      if(okayToDelete){
        const fileDeleter = new XMLHttpRequest()
        const envelope = new FormData()
        envelope.append('filename', filename)
        envelope.append(`uploadPath`, m.uploadPath)
        fileDeleter.open('POST', 'php/deleteFile.php')
        fileDeleter.send(envelope)
        //-------------------------------------//
        fileDeleter.onload = function(){
          if(fileDeleter.status === 200){
              c.getFileList()
          }
          else{
              alert('Trouble Deleting File')
          }
        }
      }
    }
    else if(xhr.status !== 200){
      alert("Trouble at the server.")
    }
  }//------| END of xhr onload handler |--------//
}

