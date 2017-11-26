/*global L*/
/*global m*/
/*global v*/
/*global c*/

//====================| HELPER methods |=========================//
c.goBack = function(){
    //close the big folder
    v.folderFront.styles('transform: rotateX(-30deg)')(`transition: all 1s ease`)
    v.folderTitle.styles('transform: rotateX(-30deg)')
    v.folderShadow.styles(`transition: all 1s ease`)(`transform: rotateX(-94deg)`)
    
    //one card prior
    m.breadCrumbsArray.pop()
    const cardId = m.breadCrumbsArray[m.breadCrumbsArray.length -1].cardId
    c.showCard(v[cardId])
    c.layBreadcrumbs()    
}
//--------------------------------------------------------//
c.layBreadcrumbs = function(){
  const arrowIcon = ` ➜ `
  v.crumbTrail.innerHTML = ``
  const crumb = document.createElement('div')
  crumb.setAttribute(`id`, `p0`)
  crumb.classList.add('crumb')
  const title = document.createTextNode(m.breadCrumbsArray[0].topicTitle)
  crumb.appendChild(title)
  v.crumbTrail.appendChild(crumb)

  m.breadCrumbsArray.forEach( (crumbObject, i) => {
    if(i !== 0){
      //make a crumb and its text and put in its class
      const crumb = document.createElement('div')
      crumb.setAttribute(`id`, `p${i}`)
      const title = document.createTextNode(crumbObject.topicTitle) 
      crumb.classList.add(`crumb`)
      
      //make an arrow (span) and its text and put it in its class
      const arrow = document.createElement('span')
      const arrowhead = document.createTextNode(arrowIcon)
      arrow.classList.add(`arrow`)
      
      //put the arrow icon in the arrow
      arrow.appendChild(arrowhead)
      
      //put the arrow in the crumb
      crumb.appendChild(arrow)
      
      //put the text in the crumb
      crumb.appendChild(title)
      
      //put crumb on the trail
      //v.crumbTrail.appendChild(crumb)
      v.crumbTrail.appendChild(crumb)
    }
  })
}


//------------------------------------------//
c.runGatekeeper = function(){
  const checker = new XMLHttpRequest()
  checker.open(`POST`, `php/setAccessLevel.php`)
  checker.send();
    //-----------------//
  checker.onload = function(){
    if(checker.response !== 'high' && checker.response !== 'low'){
      v.passwordWall.style.visibility = 'visible'
      v.shroud.style.visibility = `visible`
      v.shroud.style.opacity = `1`
    }
    else if(checker.status === 200){
      v.passwordWall.style.visibility = 'hidden'
      v.shroud.style.visibility = `hidden`
      v.shroud.style.opacity = `0`           
    }
 }//----| end of access level check |--------// 
 checker.onerror = function(){
    v.passwordWalll.style.visibility = 'visible'
    v.shroud.style.visibility = `visible`
    v.shroud.style.opacity = `1`         
  } 
}

//------------------------------//
c.goHome = function(){
  c.hideAllCards()
  v.breadCrumbsScreen.styles(`visibility: hidden`)  
  //now show the home card
}
//----------------------------------------------------//
c.showCard = function(cardObject){
  c.hideAllCards()
  
  //now show cardObject
  if(cardObject){
    cardObject.styles(`visibility: visible`)
  }
}

//------------------------------------------------------//
c.hideAllCards = function(){
  //hide all cards
  const allCardsArray = document.querySelectorAll('.card')
  const array = []
  array.forEach.call( allCardsArray, m => {
    v[m.id].styles(`visibility: hidden`)
  } )
  v.crumbTrail.innerHTML = ``
  c.showBigFolder(false)

}
//-----------------------------------------------//
c.showBigFolder = function(show = true){
  let visible = `visible`
  let time = 1
  
  show ? visible = `visible` : visible = `hidden`
  show ? time = 0.5 : time = 0
  
  const shadowSpeed = time / 2
  v.folderShadow.styles(`transition: all ${shadowSpeed}s linear`)(`visibility: ${visible}`)
  v.folderFront.style.transition = `all ${time}s ease`
  v.folderFront.styles(`visibility: ${visible}`)
  v.folderTitle.styles(`transition: all ${time}s ease`)(`visibility: ${visible}`)
  v.outerFileFrame.styles(`visibility: ${visible}`)
  v.documentFrame.styles(`visibility: ${visible}`)
  v.fileControls.styles(`visibility: ${visible}`)
  v.fileFrame.styles(`visibility: ${visible}`)
  
  v.fileBackground.styles(`visibility: ${visible}`) 
  v.fileElement.styles(`visibility: ${visible}`)    
  
  if(!show){
    v.uploadAssembly.styles(`visibility: ${visible}`) 
    v.btnDeleteFile.styles(`visibility: ${visible}`) 
  
  }
}

//-----------------------------------------------//
c.toggleUploadButton = function(){
  clearTimeout(m.timerUploadButton)
  v.fileBackground.styles
    (`background-image: linear-gradient(blue, lightblue)`)
    (`box-shadow: inset 1px 1px 2px black`)
    (`font-size: 0.99rem`)
  m.timerUploadButton = setTimeout(function(){
    v.fileBackground.styles
      (`background-image: linear-gradient(lightblue, blue)`)
      (`box-shadow: 1px 1px 2px black`)
      (`font-size: 1rem`)    
  }, 250)
}

//-------------------------------------------------//
c.initializeBreadCrumbs = function(){
  m.breadCrumbsArray.push({cardId: `home`, topicTitle: `Home`, topicId: ``})
  m.breadCrumbsArray.push({cardId: `years`, topicTitle: `Academic Assessment Data`, topicId: `aad`})
  m.breadCrumbsArray.push({cardId: `programs`, topicTitle: `2016-2107 Assessment Cycle`, topicId: `y1617`})
  m.breadCrumbsArray.push({cardId: `foldersDegreePrograms`, topicTitle: `A.S. Degrees`, topicId: `as`})
  
  c.layBreadcrumbs()
}
//-------------------------------------------------------//
c.applyPermissionsToDocumentFolder = function(){
  const checker = new XMLHttpRequest()
  checker.open(`POST`, `php/getAccessLevel.php`)
  checker.send();
  //-----------------//
  checker.onload = function(){
    if(checker.status === 200){
      if(checker.response === 'high'){c.allowFullAccess()}//
      else if(checker.response === 'low'){c.allowReadonlyAccess()}
     }
    else{
      alert(`Trouble at the server: ${checker.status}`)
    }
  }
  checker.onerror = function(){
      alert(`Trouble connecting the server: ${checker.status}`)
  }
}
//-------------------------------------------------------//

c.allowReadonlyAccess = function(){
  v.fileFrame.styles(`visibility: hidden`)
  v.fileElement.styles(`visibility: hidden`)
  v.fileBackground.styles(`visibility: hidden`)
  v.btnDeleteFile.styles(`visibility: hidden`)
  
  //move select window up into a the space
  v.documentFrame.styles(`bottom: 30%`)
  v.outerFileFrame.styles(`height: 65%`)
  v.outerFileFrame.styles(`top: 54%`)  
}
//-----------------------------------------------//
c.allowFullAccess = function(){
  //show upload and delete???
  v.fileFrame.style.visibility = `visible`
  v.fileElement.styles(`visibility: visible`)
  v.fileBackground.styles(`visibility: visible`)  
  v.btnDeleteFile.style.visibility = `visible`
  
  //restore select window
  v.documentFrame.style.bottom = `20%`
  v.fileControls.style.top = `70%`
  v.outerFileFrame.style.height = `100%`
  v.outerFileFrame.style.top = `35%`
}

//-------------------------------------------------//
c.hideDocumentViewer = function(){
  v.documentViewer.style.visibility = 'hidden' 
  v.viewerFrame.src = 'DocumentLoading.html'
  v.viewingDocumentName.innerText = ``
}
//-----------------------------------------//
c.displayDocument = function(){
  v.viewerFrame.src = 'DocumentLoading.html'   

  const index = v.documentSelector.selectedIndex !== -1 ? v.documentSelector.selectedIndex : 0
  const filename = v.documentSelector.options[index].innerText
  
  const url = `${m.baseUrl}${m.localUploadPath}${filename}`
  const ext = filename.slice(-3).toLowerCase()            
  if( ext === 'mp3' ||
      ext === 'jpg' ||
      ext === 'gif' ||
      ext === 'png' ||
      ext === 'aac' ||
      ext === 'mp4' ||
      filename.slice(-4).toLowerCase() === 'jpeg' ){
    window.open(`${m.localUploadPath}${filename}`)
  }
  else{
    v.viewingDocumentName.innerText = filename
    v.viewerFrame.src = `https://docs.google.com/gview?url=${url}&embedded=true`
    v.documentViewer.style.visibility = 'visible'              
  }
}
c.showDocument = c.displayDocument

//-----------------------------------------------//
c.noWiggle = function(){
  if(m.moveCount > 1 && m.moved){
    if(m.source.tagName.toLowerCase() !== 'input'){
      m.eventObject.preventDefault()      
    }
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
}
//--------------------------------------------//

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
  v.spinner.styles(`visibility: hidden`)  
}

//-----------------------------------------------//
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
  
  //mark which files still need to finish uploading:
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
    }, 2000)
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


//======================================================================//
c.fillDocumentSelector = function (filesString){
    const currentFilename = v.documentSelector.options[v.documentSelector.selectedIndex] && v.documentSelector.options[v.documentSelector.selectedIndex].innerText
    v.documentSelector.innerHTML = ''
    const filenameArray = filesString.split('\n')
    filenameArray.pop() // get rid of the blank last entry
    //sort the array by filename extension (optional; can omit)
    L.sortByExtension(filenameArray)
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
      `You currently don't have permission to delete files.
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

