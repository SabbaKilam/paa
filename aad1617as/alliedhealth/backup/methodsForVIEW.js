/*global L*/
/*global m*/
/*global v*/
/*global c*/

//===| functions that update the VIEW |=======//
c.showEvents = function(){
  const moveCount = (m.moved) ? ` (${m.moveCount})` : ``
  const info = `${m.id}: ${m.type}${moveCount}, prior event: ${m.eventObjects[0].type}`
  //const info = `EVENT: ${m.eventObjects[0].type},  PRIOR: ${m.eventObjects[1].type},  2-PRIOR: ${m.eventObjects[2].type}`
  //const info = `TIME: ${(m.elapsedTimes[0]/1000).toFixed(2)},  PRIOR: ${(m.elapsedTimes[1]/1000).toFixed(2)}`
  v.info.innerText = info
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

//=======| resize-related function properties |=======//
c.showResize = function(){
  c.adjustFolderWidth()
  setTimeout(c.attachFolderShadow,50)
}

c.adjustFolderWidth = function(){
  if(m.innerWidth >= m.MAX_WIDTH){
    v.folderFrame.styles(`width: ${m.MAX_WIDTH}px`)
    v.folderShadow.styles(`width: ${m.MAX_WIDTH}px`)
  }else{
    v.folderFrame.styles('width: 97%')
    v.folderShadow.styles('width: 97%')
  }
}

c.showToggleFolder = function(){
  m.folderIsOpen ? c.openFolder() : c.closeFolder()
}