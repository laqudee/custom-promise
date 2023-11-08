const CustomPromise = require('./dist/index.js')

// Use Promises/A+ Compliance Test Suite
// Test CustomPromise
// https://github.com/promises-aplus/promises-tests/blob/master/README.md
CustomPromise.deferred = function () {
  var result = {}
  result.promise = new CustomPromise(function (resolve, reject) {
    result.resolve = resolve
    result.reject = reject
  })

  return result
}

module.exports = CustomPromise
