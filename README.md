# Promisify
Converts callback functions to promises.

Usage:
```
function testfunction(number, success, failure) {
 if(number) {
  success(true)
 } else {
  failure(false)
} }

testpromise = promisify(testfunction)
promisify("testfunction")

testfunction(5).then(function(result) {
 console.log(result)
}).catch(function(error) {
 console.log(error)
})
```

Requires <a href="https://github.com/DanielHerr/Iterators">Iterators</a> if promisifying objects.
