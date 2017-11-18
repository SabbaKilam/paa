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
    /*return (1/1200) * width + (5.5/12)*/
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
}
//------------