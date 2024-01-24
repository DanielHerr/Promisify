# Promisify
Converts Chrome extension API callback functions to support promises. Dependent only on Promise.

Usage:
```
console.log(await promisify_chrome_callback_function(chrome.runtime.getPlatformInfo)())

promisify_chrome_function(chrome.management, "getSelf")
console.log(await chrome.management.getSelf())
chrome.management.getSelf(console.log)

promisify_chrome_object(chrome.runtime)
console.log(await chrome.runtime.getPlatformInfo())
chrome.runtime.getPlatformInfo(console.log)
console.log(chrome.runtime.getManifest())

```
