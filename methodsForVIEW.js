/*global L*/
/*global m*/
/*global v*/
/*global c*/

//===| functions that update the VIEW |=======//
c.adjustFolderWidth = function(){
  if(m.innerWidth >= m.MAX_WIDTH){
    v.folderFrame.styles(`width: ${m.MAX_WIDTH}px`)
    //v.folderShadow.styles(`width: ${m.MAX_WIDTH}px`)
  }else{
    v.folderFrame.styles('width: 97%')
    //v.folderShadow.styles('width: 97%')
  }
}

//----------------------------------------------//
c.showEvents = function(){
  const moveCount = (m.moved) ? ` (${m.moveCount})` : ``
  const info = `${m.id}: ${m.type}${moveCount}, prior event: ${m.eventObjects[0].type}`
  //const info = `EVENT: ${m.eventObjects[0].type},  PRIOR: ${m.eventObjects[1].type},  2-PRIOR: ${m.eventObjects[2].type}`
  //const info = `TIME: ${(m.elapsedTimes[0]/1000).toFixed(2)},  PRIOR: ${(m.elapsedTimes[1]/1000).toFixed(2)}`
  v.footerInfo.innerText = info
  //
}

c.showShroudHidden = function (){
  v.shroud.styles
      ('opacity: 0')
      ('visibility: hidden')
}

c.showShroudVisible = function(){
  v.shroud
    .styles
      ('opacity: 1') 
      ('visibility: visible')
}


c.showClearLocalStorage = function(){
    window.localStorage.clear('m')
}


c.showResize = function(){  
  const width = window.innerWidth
  c.makeTitleArc(m.titleCharacters, v.fanHolder, angle(width))
  //adjustMenuPosition()
  shiftLogo()
  //---| helper(s) |-----//
  function angle(width){
    return (1/1200) * width + (7.5/12)    
  }
  //------
  function adjustMenuPosition(){
    const h = window.innerHeight;
    const w = window.innerWidth;
    if(h <= w){
      v.menusHolder.styles('bottom: 40px')
    }
    else if(h > w){
      v.menusHolder.styles('bottom: 22%')      
    }
  }
  //-------
  function shiftLogo(){
    if(!m.isPortrait && window.innerWidth > 600){
         v.header.styles('padding-top: 2.5rem')
    }
    else if(m.isPortrait || window.innerWidth <= 600){
      v.header.styles('padding-top: 3rem')
    }
  }
  //========| FOLDER STUFF |---------------------//
  c.adjustFolderWidth()
  //setTimeout(c.attachFolderShadow,50)  
}
//----------| END showResize |------------//


c.showToggleFolder = function(){
  c.getFileList()  
  m.folderIsOpen ? c.openFolder() : c.closeFolder()
}
//----------------------------------------------------//
c.openFolder = function(){
  v.folderFront.styles('transform: rotateX(-180deg)')
  v.folderTitle.styles('transform: rotateX(-180deg)')
  if(m.uploading){
    v.uploadAssembly.styles(`visibility: visible`)
  }
  v.outerFileFrame.styles(`visibility: visible`)
  v.documentFrame.styles(`visibility: visible`)
  v.uploadAssembly.styles(`transform: rotateX(-180deg)`)(`transition: all 0.65s ease`)
  v.folderShadow.styles
    (`transition: all 1s ease`)
    (`transform: rotateX(-180deg)`)
}

//----------------------------------------------------//
c.closeFolder = function(){
  v.folderFront.styles('transform: rotateX(-30deg)')
  v.folderTitle.styles('transform: rotateX(-30deg)')
  v.uploadAssembly.styles(`transform: rotateX(-300deg)`)(`visibility: hidden`)(`transition: all 0s linear`)  
  v.folderShadow.styles
    (`transition: all 1s ease`)
    (`transform: rotateX(-94deg)`)
}
