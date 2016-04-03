"use strict"

function promisify(item, {
 type = "web" || "chrome" || "node", returns = false
} = {}) {
 if(typeof(item) == "function") {
  return(new Proxy(item, {
   apply(target, that, inputs) {
    let result, resolve, reject
    inputs.push(function(...results) {
     Promise.resolve().then(function() {
      if(result !== undefined) {
       results.unshift(result)
      }
      if(type == "chrome" && chrome.runtime.lastError) {
       reject(chrome.runtime.lastError.message)
      }
      else if(type == "node" && results[0] != null) {
       reject(results[0])
      }
      else if(results.length == 1) {
       resolve(results[0])
      } else {
       resolve(results)
    } }) })
    if(type == "web") {
     inputs.push(function(error) {
      Promise.resolve().then(function() {
       reject(error)
    }) }) }
    result = Reflect.apply(target, that, inputs)
    if(result !== undefined && returns == false) {
     return(result)
    } else {
     return(new Promise(function(resolver, rejecter) {
      resolve = resolver
      reject = rejecter
 })) } } })) }
 else if(typeof(item) == "object") {
   return(new Proxy(item, {
    get(target, key) {
     let value = Reflect.get(target, key)
     if(typeof(value) == "function") {
      return(promisify(value, { type, returns, watch }))
     }
     if(typeof(value) == "object") {
      return(promisify(value, { type, returns, watch }))
     } else {
      return(value)
} } })) } }
