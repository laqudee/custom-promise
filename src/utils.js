import CustomPromise from './index.js'
import { STATE } from './enum.js'

export function isThenable(value) {
  return value instanceof CustomPromise
}

export function isThenableNormal(value) {
  if (
    typeof value === 'object' &&
    value !== null &&
    value.then &&
    typeof value.then === 'function'
  ) {
    return true
  }
  return false
}

export function addHandlers(instance, handlers) {
  instance.handlers.push(handlers)
  executeHandlers(instance)
}

export function executeHandlers(instance) {
  if (instance.state === STATE.PENDING) {
    return null
  }

  instance.handlers.forEach((handler) => {
    if (instance.state === STATE.FULFILLED) {
      return handler.onSuccess(instance.value)
    }
    return handler.onFail(instance.value)
  })

  instance.handlers = []
}
