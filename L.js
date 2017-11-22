/*
  Author:  Abbas Abdulmalik
  Created: ~ May, 2017
  Revised: November 22, 2017 
  Original Filename: L.js 
  Purpose: a small personal re-usable js library for a simple MVC architecture
  Notes: Now qualifyFunction helper doesn't return true for empty arrays (no vacuous truth)
         UploadFiles added.
         uploadFiles takes a callback -- progressReporter-- as it FIRST argument (parameter)
         to allow for an optional fourth parameter of an upload path for the server.
         progressReporter will be passed three arguments when called:
         1.) the amount of bytes uploaded so far
         2.) the total size of the file in bytes
         3.) the index of the file in the "array" of files being uploaded
         
         Added sortByExtension that alphabetizes an array of strings in place by filename extension 
*/

var L = {}
L.styles = function(styleString){
  const colonPosition = styleString.indexOf(':')
  const property = styleString.slice(0, colonPosition)
  const value = styleString.slice(colonPosition + 1)
  this.style[property] = value
  
  return this.styles  
}

L.attributes = function(attributeString){
  const assignmentPosition = attributeString.indexOf('=')
  const attribute = attributeString.slice(0, assignmentPosition)
  const value = attributeString.slice(assignmentPosition + 1)
  this.setAttribute(attribute, value)
  
  return this.attributes
}

L.attribs = L.attributes // a shorter reference

L.attachAllElementsById = function(here){
  let allElements = document.getElementsByTagName('*')
  let array = []
  array.forEach.call(allElements, function(element)  {
      if(element.id){
          here[element.id] = element
          element.styles = L.styles.bind(element) // attach L's styles() method here
          element.attributes = L.attributes.bind(element) // attach L's atributes() method here
      }
  })
}

L.noPinchZoom = function(){
  window.ontouchstart = function(eventObject){
    if(eventObject.touches && eventObject.touches.length > 1){
       eventObject.preventDefault(); 
    }
  }  
}

L.runQualifiedMethods = function(functionQualifiers, object, runNextUpdate){
  Object
    .keys(functionQualifiers)
    .filter(qualifyFunction)
    .forEach(runFunction)
  if(typeof runNextUpdate === 'function'){runNextUpdate()}
  
  //-----| helpers |-----//
  function qualifyFunction(functionName){
    const isQualified = functionQualifiers[functionName].every( qualifier => qualifier) &&
                        !!functionQualifiers[functionName].length
    return isQualified
  }
  function runFunction(functionName){
    if(typeof object[functionName] === 'function'){
      object[functionName]()        
    }
   
    /*
      If the prefix of this function's name is 'set' (for updating the MODEL),
      and there is a similarly named function with a prefix of 'show' (for updating the VIEW),
      then run the 'show' version as well.
    */
    let prefix = functionName.slice(0,3)
    let newFunctionName = 'show' + functionName.slice(3)
    
    if(prefix === 'set' && typeof object[newFunctionName] === 'function'){
      object[newFunctionName]()
    }
  }
}

L.uploadFiles = function(progressReporter, fileElement, phpScriptName, uploadPath='../uploads/'){
  const array = [] // make a real array to borrow it's forEach method
  array.forEach.call(fileElement.files, (file, index) => {
    const postman = new XMLHttpRequest() // make a file deliverer for each file
    const uploadObject = postman.upload // This object keeps track of upload progress
    const envelope = new FormData() // make a holder for the file's name and content
    envelope.stuff = envelope.append // give 'append' the nickname 'stuff'
    const reader = new FileReader() // make a file reader (the raw file element is useless)
    
    reader.readAsDataURL(file) // process the file's contents
    reader.onload = function(){ // when done ...
      const contents = reader.result // collect the result, and ...
      envelope.stuff('contents', contents) // place it in the envelope along with ...
      envelope.stuff('filename', file.name) // its filename
      envelope.stuff('uploadPath', uploadPath) // its upload path on the server
      
      postman.open(`POST`, phpScriptName)// open up a POST to the server's php script
      postman.send(envelope) // send the file
      
      //check when file loads and when there is an error
      postman.onload = eventObject => {
        postman.status !== 200 ? showMessage() : false
        //-----| helper |------//
        function showMessage(){
          const message = `Trouble with file: ${postman.status}`
          console.log(message)
          alert(message)
        }
      }
      
      postman.onerror = eventObject => {
        const message = `Trouble connecting to server`
        console.log(message)
        alert(message)
      }
      
      //invoke the callback for each upload progress report
      uploadObject.onprogress = function(progressObject){
        if(typeof progressReporter === 'function'){
          progressReporter(progressObject.loaded, progressObject.total, index)
        }
      }
    }
  })
}
//---------------------------------------------------------//
/**
  Given an array of strings (array), sorts the array 'in place' by filename EXTENSION,
  and returns a copy of the array as well. Since it mutates the array, it is decidedly not
  functionistic (but it functions).
*/
L.sortByExtension = function (array) {
  const type = {}.toString.call(array, null);
  if (type !== '[object Array]') {
    return array;
  }
  if (array.length === 0 || array.some(member => typeof member !== 'string')) {
    return array;
  }
  //-------------------------------------//
  let extension = ``;
  let nudeWord = ``;  
  array.forEach((m, i, a) => {
    if (m.lastIndexOf(`.`) !== -1) {
      //get the extension
      extension = m.slice(m.lastIndexOf(`.`) + 1);
      nudeWord = m.slice(0, m.lastIndexOf(`.`));
      a[i] = `${extension}.${nudeWord}`;
    }
  });
  
  array.sort();
  
  array.forEach((m, i, a) => {
    if (m.indexOf(`.`) !== -1){
      //get prefix (formerly the extension)
      extension = m.slice(0, m.indexOf(`.`))
      nudeWord = m.slice(m.indexOf(`.`) + 1)
      a[i] = `${nudeWord}.${extension}`
    }
  });
  
  return array;
}