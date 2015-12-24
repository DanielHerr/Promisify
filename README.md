# Promisify
Converts callback functions to promises.

Usage:
```javascript
function testglobalfunction(number, success, failure) {
 if(number) {
  success(true)
 } else {
  failure(false)
} }

promisify("testglobalfunction")

testglobalfunction(5).then(function(result) {
 console.log(result)
}).catch(function(error) {
 console.log(error)
})
```
