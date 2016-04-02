"use strict"

function promisify(callbackfunction) {
 return(new Proxy(callbackfunction, {
  apply(target, that, inputs) {
   return(new Promise(function(resolve, reject) {
    target.call(that, ...inputs, function(...results) {
     if(results.length == 1) {
      results = results[0]
     }
     resolve(results)
    }, reject)
})) } })) }
