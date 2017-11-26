/*global L*/
/*global m*/
/*global v*/
/*global c*/

//===| functions that UPDATE MODEL |========//
//=============| UPDTAE BASIC STATES AND METAP_EVENTS |==========================//
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
  
  
  m.folderClicked = folderClicked()
  //------| helper |--------//
  function folderClicked(){
    const fakeFolderArray = document.getElementsByClassName('clickableFolder')
    const realArray = []
    return realArray.includes.call(fakeFolderArray, m.source) && m.clicked
  }
  
  m.crumbClicked = crumbClicked()
  //------| helper |--------//
  function crumbClicked(){
    const fakeFolderArray = document.getElementsByClassName('crumb')
    const realArray = []
    return realArray.includes.call(fakeFolderArray, m.source) && m.clicked
  }
  
    
  //save the updated model in localStorage  
  c.updateLocalStorage()  
}

//=============| END of UPDATE BASIC STATES AND META-EVENTS |==========================//
 
c.setCrumbClicked = function(){
 const position = parseInt(m.id.slice(1), 10)
 const maxIndex = m.breadCrumbsArray.length - 1
 position === 0 ? c.goHome() : backtrack()
 //----| helper |----//
 function backtrack(){
    if(position === maxIndex){
        alert("You're already here.")
    }
    else{
      //close the big folder
      v.folderFront.styles('transform: rotateX(-30deg)')(`transition: all 1s ease`)
      v.folderTitle.styles('transform: rotateX(-30deg)')
      v.folderShadow.styles(`transition: all 1s ease`)(`transform: rotateX(-94deg)`)  
      
      const popCount = maxIndex - position
      for(let i=0; i< popCount; i++){
        m.breadCrumbsArray.pop()     
      }
      const cardId = m.breadCrumbsArray[m.breadCrumbsArray.length -1].cardId
      c.showCard(v[cardId])
      c.layBreadcrumbs()
    }
 }
}

//-------------------------------------//
c.setFolderClicked = function(){
  //the element's 'title' attribute has the folder's display title
  m.folderTitle = m.source.title
  
  //push current card
  m.breadCrumbsArray.push({cardId: `folderAssembly`, topicTitle: `${m.folderTitle}`, topicId: ``})

  c.layBreadcrumbs()
  
  /*
  const arrow = ` ➜ `
  //set trail = `${m.breadCrumbsArray[0].topicTitle}${arrow}${m.breadCrumbsArray[1].topicTitle}${arrow}${m.breadCrumbsArray[2].topicTitle}${arrow}${m.breadCrumbsArray[3].topicTitle}` 
  let trail = m.breadCrumbsArray.reduce( (result, crumb) => `${result}${arrow}${crumb.topicTitle}` , ``)
  trail = trail.slice(3) //take off leading arrow and its spaces
  v.testCrumb.innerText = trail
   */
  //combine topic ids to form the proper folder name. ex: aad + y1617 + as = aady1617as
  const folderName = m.breadCrumbsArray.reduce((result, crumb) => `${result}${crumb.topicId}`, '')
  
  //for filepath, combine the folder name with id of the currently clicked folder
  m.localUploadPath = `${folderName}/${m.id}/uploads/` 
  m.uploadPath =`../${folderName}/${m.id}/uploads/`

  c.showBigFolder(true);
  
}

//-----------------------------------------------//
c.setToggleFolder = function(){
  //c.applyPermissionsToDocumentFolder()
  m.folderIsOpen = !m.folderIsOpen
}

//------------------| UPLOAD FILES |------------------------//
c.setUploadFiles = function(){
  if(!v.fileElement.files[0]){return}  
  c.clearUploadData()
  const xhr = new XMLHttpRequest()
  xhr.open('POST', `php/getAccessLevel.php`)
  xhr.send();
  //----------------//
  xhr.onload = function(){
    if(xhr.status === 200){
      if(xhr.response !== `high`){
        const message = 
        `You currently don't have permission to upload.
         Try logging out and logging in again.`
        alert(message)
        c.logOut()
      }
      else{
        m.uploading = true 
        v.fileElement.styles(`visibility: hidden`)
        v.spinner.styles(`visibility: visible`)
        v.uploadAssembly.styles(`visibility: visible`)
        
        //save file status object filesToUpload array
        const array = [];
        array.forEach.call(v.fileElement.files, file=>{
          m.filesToUpload.push({name: file.name, done: false})
        })
        
        // list the name of each file to be uploaded
        array.forEach.call(v.fileElement.files, file=>{
          v.divFilenames.innerHTML += `${file.name}<br>`
        })
        
        //provide: callback, fileElement, scriptname, uploadPath
        L.uploadFiles(c.showProgress, v.fileElement, m.scriptPath, m.uploadPath)
      }      
    }
    else if (xhr.status !== 200){
      alert(`Problem at the server: ${xhr.response}`);
    }
  }
}
//------------------| END of UPLOAD FILES |------------------------//

c.setCheckPassword = function(){
  const checker = new XMLHttpRequest()
  const envelope = new FormData()
  envelope.append('userPassword', v.txtPassword.value)
  checker.open('POST', 'php/setAccessLevel.php')
  checker.send(envelope) 

  //----------------------------//
  checker.onload = function(){
    if(checker.status === 200){
      if(checker.response === 'low' || checker.response === 'high'){
        c.bringDownWall()
        c.allowReadonlyAccess()        
      }
      m.accessLevel = checker.response//must elimniate this variab
    }
  }
  checker.onerror = function(){
    alert('Trouble connecting to server.')
  }
}

//---------------------------------
c.setShroudHidden = function (){
  m.shroudIsVisible = false
  m.popupIsVisible = false
  c.updateLocalStorage()  
}

c.setShroudVisible = function(){
  m.shroudIsVisible = true
  c.updateLocalStorage()  
}

c.setPopupToggle = function(){
  m.popupIsVisible = !m.popupIsVisible
  c.updateLocalStorage()  
}

c.setOfflineStatus = function(){
  if(m.type === 'online'){
    m.isOnline = true;
  }
  else if(m.type === 'offline'){
    m.isOnline = false;
  }
  c.updateLocalStorage()  
}

c.setResize = function(){
  m.innerWidth = window.innerWidth
  m.isPortrait = window.innerHeight >= window.innerWidth  
  c.updateLocalStorage()
}

c.setClearLocalStorage = function(){
  m.btnClearLocalStorageIn = !m.btnClearLocalStorageIn
  c.updateLocalStorage()  
}
