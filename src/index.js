import { STATE } from './enum.js'
import { isThenable, addHandlers } from './utils.js'

export default class CustomPromise {
  constructor(callback) {
    this.state = STATE.PENDING
    this.value = undefined
    this.handlers = []

    // Invoke callback by passing the _resolve fucntion and the _reject function of class
    try {
      callback(this._resolve, this._reject)
    } catch (err) {
      this._reject(err)
    }
  }

  _resolve = (value) => {
    this.updateResult(value, STATE.FULFILLED)
  }
  _reject = (error) => {
    this.updateResult(error, STATE.REJECTED)
  }

  updateResult(value, state) {
    // The setTimeout() to make processing async
    setTimeout(() => {
      // Process the promise if it is in pending state
      // Else not process
      if (this.state != STATE.PENDING) {
        return
      }

      // Check the value is also a promise
      if (isThenable(value)) {
        return value.then(this._resolve, this._reject)
      }

      this.value = value
      this.state = state

      // Execute handlers if already attached
      this.executeHandlers()
    }, 0)
  }

  then(onSuccess, onFail) {
    return new CustomPromise((res, rej) => {
      addHandlers(this, {
        onSuccess: function (value) {
          // if no onSuccess function provided, resolve the value for the next promise chain
          if (!onSuccess) {
            return res(value)
          }
          try {
            return res(onSuccess(value))
          } catch (err) {
            return rej(err)
          }
        },
        onFail: function (value) {
          // if no onFail function provided, reject the value for the next promise chain
          if (!onFail) {
            return rej(value)
          }
          try {
            return res(onFail(value))
          } catch (err) {
            return rej(err)
          }
        }
      })
    })
  }

  executeHandlers() {
    if (this.state === STATE.PENDING) {
      return null
    }

    this.handlers.forEach((handler) => {
      if (this.state === STATE.FULFILLED) {
        return handler.onSuccess(this.value)
      }
      return handler.onFail(this.value)
    })

    this.handlers = []
  }

  catch(onFail) {
    return this.then(null, onFail)
  }

  finally(callback) {
    return new CustomPromise((res, rej) => {
      let val
      let wasRejected
      this.then(
        (value) => {
          wasRejected = false
          val = value
          return callback()
        },
        (err) => {
          wasRejected = true
          val = err
          return callback()
        }
      ).then(() => {
        // If the callback didn't have any error we resolve/reject the promise based on promise state
        if (!wasRejected) {
          return res(val)
        }
        return rej(val)
      })
    })
  }
}
