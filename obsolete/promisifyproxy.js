"use strict"


function promisify(item, {
 type = "web" || "chrome" || "node", returns = false, recursive = true, watch = false
} = {}) {
 if(typeof(item) == "function") {
  return(new Proxy(item, {
   apply(target, that, inputs) {
    let result, resolve, reject
    inputs.push(function(...results) {
     let error
     if(type == "chrome" && chrome.runtime.lastError) {
      error = chrome.runtime.lastError.message
     }
     else if(type == "node" && results[0] != null)
      error = results[0]
     }
     Promise.resolve().then(function() {
      if(result !== undefined) {
       results.unshift(result)
      }
      if(error) {
       reject(error)
      }
      else if(results.length == 1) {
       resolve(results[0])
      }
      else if(results.length == 0) {
       resolve()
      } else {
       resolve(results)
    } }) })
    if(type == "web") {
     inputs.push(function(error) {
      Promise.reject(error).catch(reject)
    }) }
    try {
     result = Reflect.apply(target, that, inputs)
     if(result !== undefined && returns == false) {
      return(result)
     } else {
      return(new Promise(function(resolver, rejecter) {
       resolve = resolver
       reject = rejecter
     })) }
    } catch(error) {
     if(returns) {
      return(Promise.reject(error))
     } else {
      throw(error)
 } } } })) }
 else if(typeof(item) == "object") {
  if(watch) {
   return(new Proxy(item, {
    get(target, key) {
     let value = Reflect.get(target, key)
     if(typeof(value) == "function" || (recursive && typeof(value) == "object")) {
      return(promisify(value, { type, returns, recursive, watch }))
     } else {
      return(value)
   } } }))
  } else {
   let proxy = new Proxy(item, {})
   for(let { key, value } of proxy) {
    if(typeof(value) == "function" || (recursive && typeof(value) == "object")) {
     Reflect.set(proxy, key, promisify(value, { type, returns, recursive, watch }))
    } else {
     Reflect.set(proxy, key, value)
   } }
   return(proxy)
} } }
