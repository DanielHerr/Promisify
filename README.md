# Promisify
Converts callback functions to promises. Requires <a href="https://github.com/DanielHerr/Object-Loops">Object Loops</a> if promisifying objects.

Usage:
```javascript
function testfunction(number, success, failure) {
 if(number) {
  success(true)
 } else {
  failure(false)
} }

promisify("testfunction")

testfunction(5).then(function(result) {
 console.log(result)
}).catch(function(error) {
 console.log(error)
})
```
