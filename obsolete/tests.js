"use strict"

test("async callback success, type web", function(pass, fail) {
 let result1 = function(input, success, failure) {
  Promise.resolve(input).then(success)
 }
 let result2 = promisify(result1, { type: "web" })
 result2(4).then(function(result3) {
  if(result3 == 4) {
   pass()
  } else {
   fail("result should be 4 but is " + result3)
} }) })

test("async callback multiple, type web", function(pass, fail) {
 let result1 = function(input1, input2, success, failure) {
  Promise.resolve().then(function() {
   success(input1, input2)
 }) }
 let result2 = promisify(result1, { type: "web" })
 result2(2, 4).then(function([ result3, result4 ]) {
  if(result3 == 2 && result4 == 4) {
   pass()
  } else {
   fail("result should be [ 2, 4 ] but is " + [ result3, result4 ])
} }) })

test("async callback failure, type web", function(pass, fail) {
 let result1 = function(input, success, failure) {
  Promise.reject(Error(input)).catch(failure)
 }
 let result2 = promisify(result1, { type: "web" })
 result2("4").then(function(result3) {
  fail("should reject but resolves with " + result3)
 }).catch(function(error) {
  if(error.message == "4") {
   pass()
  } else {
   fail("result should be 4 but is " + error)
} }) })

test("sync callback success, type web", function(pass, fail) {
 let result1 = function(input, success, failure) {
  success(input)
 }
 let result2 = promisify(result1, { type: "web" })
 result2(4).then(function(result3) {
  if(result3 == 4) {
   pass()
  } else {
   fail("result should be 4 but is " + result3)
} }) })

test("sync callback multiple, type web", function(pass, fail) {
 let result1 = function(input1, input2, success, failure) {
  success(input1, input2)
 }
 let result2 = promisify(result1, { type: "web" })
 result2(2, 4).then(function([ result3, result4 ]) {
  if(result3 == 2 && result4 == 4) {
   pass()
  } else {
   fail("result should be [ 2, 4 ] but is " + [ result3, result4 ])
} }) })

test("sync callback failure, type web", function(pass, fail) {
 let result1 = function(input, success, failure) {
  failure(Error(input))
 }
 let result2 = promisify(result1, { type: "web" })
 result2("4").then(function(result3) {
  fail("should reject with 4 but resolves with " + result3)
 }).catch(function(error) {
  if(error.message == "4") {
   pass()
  } else {
   fail("result should be 4 but is " + error)
} }) })

test("sync return, returns false", function() {
 let result1 = function(input) {
  return(input)
 }
 let result2 = promisify(result1, { returns: false })
 let result3 = result2(4)
 if(result3 != 4) {
  throw("result should be 4 but is " + result3)
} })

test("sync throw, returns false", function() {
 let result1 = function(input) {
  throw(Error(input))
 }
 let result2 = promisify(result1, { returns: false })
 try {
  let result3 = result2("4")
  throw("should throw 4 but returns " + result3)
 } catch(error) {
  if(error.message != "4") {
   throw("result should be 4 but is " + error)
} } })

test("sync return, returns true", function(pass, fail) {
 let result1 = function(input) {
  return(input)
 }
 let result2 = promisify(result1, { returns: true })
 result2(4).then(function(result3) {
  if(result3 == 4) {
   pass()
  } else {
   fail("result should be 4 but is " + result3)
} }) })

test("sync throw, returns true", function(pass, fail) {
 let result1 = function(input) {
  throw(Error(input))
 }
 let result2 = promisify(result1, { returns: true })
 result2("4").then(function(result3) {
  fail("should reject with 4 but resolves with " + result3)
 }).catch(function(error) {
  if(error.message == "4") {
   pass()
  } else {
   fail("result should be 4 but is " + error)
} }) })

test("async callback success, callbacks true", function(pass, fail) {
 let result1 = function(input1, input2, success) {
  Promise.resolve().then(function() {
   success(input1, input2)
 }) }
 let result2 = promisify(result1, { callbacks: true })
 let result3 = false
 result2(2, 4, function(result5, result6) {
  if(result5 == 2 && result6 == 4) {
   result3 = true
  } else {
   fail("should callback with [ 2, 4 ] but callbacks with " [ result5, result6 ])
  }
 }).then(function([ result5, result6 ]) {
  if(result3) {
   if(result5 == 2 && result6 == 4) {
    pass()
   } else {
    fail("result should be [ 2, 4 ] but is " + [ result5, result6 ])
   }
  } else {
   fail("should resolve after callbacks but resolves early with " + [ result5, result6 ])
} }) })

test("async callback failure, callbacks true", function(pass, fail) {
 let result1 = function(input, success, failure) {
  Promise.reject(Error(input)).catch(failure)
 }
 let result2 = promisify(result1, { callbacks: true })
 let result3 = false
 result2("4", function() { }, function(error) {
  if(error.message == "4") {
   result3 = true
  } else {
   fail("should callback with 4 but callbacks with " + error)
  }
 }).then(function(result4) {
  fail("should reject with 4 but resolves with " + result4)
 }).catch(function(error) {
  if(result3) {
   if(error.message == "4") {
    pass()
   } else {
    fail("result should be 4 but is " + error.message)
   }
  } else {
   fail("should reject after callbacks but rejects early with " + error)
} }) })

test("async callback success, callbacks false", function(pass, fail) {
 let result1 = function(input1, input2, success) {
  Promise.resolve().then(function() {
   success(input1, input2)
 }) }
 let result2 = promisify(result1, { callbacks: false })
 let result3 = result2(2, 4, function(result4, result5) {
  if(result4 == 2 && result5 == 4) {
   pass()
  } else {
   fail("result should be [ 2, 4 ] but is " + [ result4, result5 ])
 } })
 if(result3) {
  fail("should return undefined but returns " + result3)
} })

test("async callback failure, callbacks false", function(pass, fail) {
 let result1 = function(input, success, failure) {
  Promise.reject(Error(input)).catch(failure)
 }
 let result2 = promisify(result1, { callbacks: false })
 let result3 = result2("4", null, function(error) {
  if(error.message == "4") {
   pass()
  } else {
   fail("result should be 4 but is " + error)
 } })
 if(result3) {
  fail("should return undefined but returns " + result3)
} })

test("sync return, type chrome", function() {
 let result1 = promisify(chrome.runtime.getURL, { type: "chrome" })
 let result2 = result1("manifest.json")
 let result3 = "chrome-extension://" + chrome.runtime.id + "/manifest.json"
 if(result2 != result3) {
  throw("result should be " + result3 + " but is " + result2)
} })

test("async callback success, type chrome", function(pass, fail) {
 let result1 = promisify(chrome.runtime.getPlatformInfo, { type: "chrome" })
 result1().then(function(result2) {
  if(typeof(result2) == "object") {
   pass()
  } else {
   fail("result should be an object but is " + result2)
} }) })

test("async callback failure, type chrome")

test("async callback success, type node", function(pass, fail) {
 let result1 = function(input, callback) {
  Promise.resolve().then(function() {
   callback(null, input)
 }) }
 let result2 = promisify(result1, { type: "node" })
 result2(4).then(function(result3) {
  if(result3 == 4) {
   pass()
  } else {
   fail("result should be 4 but is " + result3)
} }) })

test("async callback failure, type node", function(pass, fail) {
 let result1 = function(input, callback) {
  Promise.reject(Error(input)).catch(callback)
 }
 let result2 = promisify(result1, { type: "node" })
 result2("4").then(function(result3) {
  fail("should reject but resolves with " + result3)
 }).catch(function(error) {
  if(error.message == "4") {
   pass()
  } else {
   fail("result should be 4 but is " + error)
} }) })

test("results true")
test("results false")

test("recursive true")
test("recursive false")

test("watch true")
test("watch false")