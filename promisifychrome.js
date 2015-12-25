"use strict"

function promisify(...functionsobjects) {
 function getsetproperty(path, value) {
  let parts = path.split(".")
  let object = self[parts.shift()]
  for(let n = 0; n < parts.length - 1; n++) {
   object = object[parts[n]]
  }
  if(arguments.length == 2) {
   object[parts[parts.length - 1]] = value
  }
  return(object[parts[parts.length - 1]])
 }
 for(let path of functionsobjects) {
  let item = self[path] || getsetproperty(path)
  if(typeof(item) == "function") {
   let oldfunction = item
   if(oldfunction.callbacks == null) {
    if(path.indexOf("chrome") == 0) {
     oldfunction.callbacks = 1
    } else {
     oldfunction.callbacks = 2
   } }
   let promise = function(...inputs) {
    return(new Promise(function(resolve, reject) {
     if(oldfunction.callbacks > 0) {
      inputs.push(function() {
       if(chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message)
       } else if(arguments.length == 1) {
        resolve(arguments[0])
       } else {
        resolve(arguments)
     } }) }
     if(oldfunction.callbacks == 2) {
      inputs.push(function(error) {
       reject(error)
     }) }
     let newfunction = oldfunction
     for(let input of inputs) {
      newfunction = newfunction.bind(null, input)
     }
     newfunction()
   })) }
   if(oldfunction.callbacks > 0) {
    if(path.includes(".")) {
     getsetproperty(path, promise)
    } else {
     self[path] = promise
   } }
  } else if(typeof(item) == "object") {
   for(let property of item) {
    promisify(path + "." + property.key)
} } } }