"use strict"

// todo messaging sendresponse handling

function promisify_chrome_object(object) {
 Object.keys(object).forEach(function(key) {
		var value = object[key]
  if(typeof(value) == "function") {
   promisify_chrome_function(object, key)
		} else if(typeof(value) == "object" && key.indexOf("on") != 0) { // todo exclude addRules etc ?
   promisify_chrome_object(value)
  }
 })
}

function promisify_chrome_callback_function(method) {
	return function() {
		if(arguments.length > 0 && typeof(arguments[arguments.length - 1]) == "function") {
			return method.apply(this, arguments)
		} else {
			var resolve, reject
			var inputs = Array.prototype.slice.call(arguments)
			inputs.push(function() {
				if(chrome.runtime.lastError) {
					reject(chrome.runtime.lastError)
				} else {
					if(arguments.length > 1) {
						resolve(Array.prototype.slice.call(arguments))
					} else {
						resolve(arguments[0])
			  }
		  }
		 })
			var promise = new Promise(function(s, j) {
				resolve = s
				reject = j
			})
			var result = method.apply(this, inputs)
			if(result !== undefined) {
    return [ result, promise ]
			} else {
    return promise
			}
		}
	}
}

function promisify_chrome_function(object, name) {
	var original = object[name]
	var modified = promisify_chrome_callback_function(original)
	object[name] = function() {
  try {
   var result = modified.apply(object, arguments)
			object[name] = modified
			return result
		} catch(error) {
   if(error.message.indexOf("No matching signature") != -1 && error.message.indexOf("function") == -1
			 || error.message.indexOf("Invocation of form") != -1
				 && error.message.indexOf("function", error.message.indexOf("doesn't match definition")) == -1
				// Error in invocation of namespace.method(function callback): No matching signature.
				// Invocation of form namespace.method(function, object) doesn't match definition namespace.method(string id)
			) {
    object[name] = original
				return original.apply(object, arguments)
			} else {
    throw error
			}
		}
	}
}

// todo handle native promise support in mv3
if(chrome.runtime.getManifest().manifest_version == 2) {
 promisify_chrome_object(chrome)
}