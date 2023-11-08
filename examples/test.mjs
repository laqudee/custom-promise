import CustomPromise from '../dist/index.mjs'

// Resolve
const testPromiseResolve = new CustomPromise((res, rej) => {
  setTimeout(() => {
    res('Promise 1 is resolved')
  }, 1000)
})
testPromiseResolve.then((val) => {
  console.log(val)
})

// Reject
const testPromiseReject = new CustomPromise((res, rej) => {
  setTimeout(() => {
    rej('Promise 2 is rejected')
  }, 1000)
})
testPromiseReject
  .catch((val) => {
    console.log(val)
  })
  .catch((err) => {
    console.log(err)
  })

// Finally
const testPromiseFinally = new CustomPromise((res, rej) => {
  setTimeout(() => {
    rej('promise 2 is rejected')
  }, 1000)
})
testPromiseFinally
  .finally((val) => {
    console.log('finally called')
  })
  .catch((err) => {
    console.log('value rejected after finally', err)
  })

// Early resolve
const testPromiseWithEarlyResolve = new CustomPromise((res, rej) => {
  res('Promise 3 is resolved early')
})
setTimeout(() => {
  testPromiseWithEarlyResolve.then((val) => {
    console.log(val)
  })
}, 3000)
