import CustomPromise from './index.js'

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
  instance.executeHandlers()
}
