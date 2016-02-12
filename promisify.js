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
 for(let item of functionsobjects) {
  if(typeof(item) == "string") {
   let path = item
   item = self[path] || getsetproperty(path)
   if(typeof(item) == "function") {
    let oldfunction = item
    oldfunction.callbacks = oldfunction.callbacks || 2
    let promise = function(...inputs) {
     let originalthis = this
     return(new Promise(function(resolve, reject) {
      if(oldfunction.callbacks > 0) {
       inputs.push(function() {
        if(arguments.length == 1) {
         resolve(arguments[0])
        } else {
         resolve(arguments)
      } }) }
      if(oldfunction.callbacks == 2) {
       inputs.push(function(error) {
        reject(error)
      }) }
      oldfunction.apply(originalthis, inputs)
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
   } }
  } else {
   if(typeof(item) == "object") {
    for(let property of item) {
     item[property.key] = promisify(property.value)
    }
    return(item)
   } else if(typeof(item) == "function") {
    let oldfunction = item
    oldfunction.callbacks = oldfunction.callbacks || 2
    if(oldfunction.callbacks > 0) {
     return(function(...inputs) {
      let originalthis = this
      return(new Promise(function(resolve, reject) {
       if(oldfunction.callbacks > 0) {
        inputs.push(function() {
         if(arguments.length == 1) {
          resolve(arguments[0])
         } else {
          resolve(arguments)
       } }) }
       if(oldfunction.callbacks == 2) {
        inputs.push(function(error) {
         reject(error)
       }) }
       oldfunction.apply(originalthis, inputs)
})) }) } } } } }
