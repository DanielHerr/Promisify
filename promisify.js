function promisify(...functions) {
 for(let name of functions) {
  let oldfunction = self[name]
  self[name] = function(...inputs) {
   return(new Promise(function(resolve, reject) {
    inputs.push(function() {
     if(arguments.length == 1) {
      resolve(arguments[0])
     } else {
      resolve(arguments)
    } })
    if((oldfunction.argumentamount || oldfunction.length) == inputs.length + 1) {
     inputs.push(function(error) {
      reject(error)
    }) }
    let newfunction = oldfunction
    for(let input of inputs) {
     newfunction = newfunction.bind(null, input)
    }
    newfunction()
})) } } }
