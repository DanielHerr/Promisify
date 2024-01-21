"use strict"

function promisify(source, {
 type = "web" || "chrome" || "node", invalidsource = "error" || "undefined" || "self",
 recursive = true, callbacks = false, results = false, returns = false, watch = false,
} = {}) {
 let proxy, options = { type, invalidsource, recursive, callbacks, results, returns, watch }
 if(datatype.is(source, "object", "array") || (datatype.is(source, "function") && options.recursive)) {
  if(options.watch) {
   proxy = new Proxy(source, {
    get(target, key) {
     let value = Reflect.get(target, key)
     if(datatype.is(value, "function") || (datatype.is(value, "object", "array") && options.recursive)) {
      return(promisify(value, options))
     } else {
      return(value)
   } } })
  } else {
   proxy = new Proxy(source, {})
   for(let [ key, value ] of loop(source, "object")) {
    if(datatype.is(value, "function") || (datatype.is(value, "object", "array") && options.recursive)) {
     Reflect.set(proxy, key, promisify(value, options))
 } } } }
 if(datatype.is(source, "function")) {
  proxy = new Proxy(proxy || source, {
   apply(target, that, inputs) {
    let result, callback, errorcallback, resolve, reject
    if(datatype.is(inputs[inputs.length - 1], "function")) {
     if(datatype.is(inputs[inputs.length - 2], "function")) {
      errorcallback = inputs.pop()
     }
     callback = inputs.pop()
    }
    if(options.callbacks || callback == null) {
     inputs.push(function(...results) {
      if(options.results) {
       for(let [ result, index ] of loop(results)) {
        results[index] = promisify(result, options)
      } }
      let error, callbackerror
      if(options.type == "chrome" && chrome.runtime.lastError) {
       error = new Error(chrome.runtime.lastError.message)
      } else if(options.type == "node" && results[0] != null) {
       error = results.shift()
      }
      Promise.resolve().then(function() {
       if(error) {
        if(callback) {
         try {
          if(options.type == "chrome") {
           chrome.runtime.lastError = { message: error.message }
           callback()
           chrome.runtime.lastError = undefined
          } else if(options.type == "node") {
           callback(error)
          }
         } catch(error) {
          callbackerror = error
        } }
        reject(error)
       } else {
        if(callback) {
         try {
          if(options.type == "node") {
           callback(null, ...results)
          } else {
           callback(...results)
          }
         } catch(error) {
          callbackerror = error
        } }
        if(results.length > 1) {
         resolve(results)
        } else {
         resolve(results[0])
       } }
       if(callbackerror) {
        throw(callbackerror)
     } }) })
     if(options.type == "web") {
      inputs.push(function(error) {
       Promise.resolve().then(function() {
        try {
         if(errorcallback) {
          errorcallback(error)
         }
         reject(error)
        } catch(callbackerror) {
         reject(error)
         throw(callbackerror)
     } }) }) }
    } else {
     if(callback) {
      inputs.push(callback)
     }
     if(errorcallback) {
      inputs.push(errorcallback)
    } }
    try {
     try {
      result = Reflect.apply(target, that, inputs)
     } catch(error) {
      if(options.type == "chrome" && callback == null && error && error.stack) {
       let stack = error.stack.slice(error.message.length + error.name.length + 3)
       if(stack.includes(" (extensions::")) {
        if(error.message.startsWith("Invocation of form ")) {
         if(error.message.endsWith("function callback)")) {
          throw(error)
         } else {
          result = Reflect.apply(target, that, inputs.slice(0, -1))
         }
        } else if(error.message.startsWith("Invalid arguments to ")) {
         result = Reflect.apply(target, that, inputs.slice(0, -1))
        }
       } else {
        throw(error)
       }
      } else {
       throw(error)
     } }
     if(result !== undefined) {
      if(options.results) {
       result = promisify(result, options)
      }
      if(options.returns) {
       return(Promise.resolve(result))
      } else {
       return(result)
      }
     } else if(options.callbacks || callback == null) {
      return(new Promise(function(resolver, rejecter) {
       resolve = resolver
       reject = rejecter
     })) }
    } catch(error) {
     if(options.returns) {
      return(Promise.reject(error))
     } else {
      throw(error)
  } } } })
  proxy.toString = source.toString.bind(source)
 }
 if(proxy) {
  return(proxy)
 } else if(options.invalidsource == "self") {
  return(source)
 } else if(options.invalidsource == "undefined") {
  return(undefined)
 } else if(options.invalidsource == "error") {
  throw(new TypeError("Unable to promisify: " + source))
} }