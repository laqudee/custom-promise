import AggregateError from 'aggregate-error'
import { STATE } from './enum.js'
import CustomPromise from './index.js'

export function resolveMethod(parameter) {
  if (parameter instanceof CustomPromise) {
    return parameter
  }

  return new CustomPromise((resolve, reject) => {
    if (parameter && parameter.then && typeof parameter.then === 'function') {
      setTimeout(() => {
        parameter.then(resolve, reject)
      })
    } else {
      resolve(parameter)
    }
  })
}

export function rejectMethod(reason) {
  return new CustomPromise((resolve, reject) => {
    reject(reason)
  })
}

export function allMethod(promiseList) {
  let resPromise = new CustomPromise((resolve, reject) => {
    let count = 0
    let result = []
    let length = promiseList.length

    if (length === 0) {
      return resolve(result)
    }

    promiseList.forEach(function (promise, index) {
      CustomPromise.resolve(promise).then(
        function (value) {
          count++
          result[index] = value
          if (count === length) {
            resolve(result)
          }
        },
        function (reason) {
          reject(reason)
        }
      )
    })
  })

  return resPromise
}

export function raceMethod(promiseList) {
  let resPromise = new CustomPromise(function (resolve, reject) {
    let length = promiseList.length

    if (length === 0) {
      return resolve()
    } else {
      for (let i = 0; i < length; i++) {
        CustomPromise.resolve(promiseList[i]).then(
          function (value) {
            return resolve(value)
          },
          function (reason) {
            return reject(reason)
          }
        )
      }
    }
  })
  return resPromise
}

export function allSettledMethod(promiseList) {
  const rejectHandler = (reason) => ({ status: 'rejected', reason })
  const resolveHandler = (value) => ({ status: 'fulfilled', value })

  const covertedPromises = promiseList.map((p) =>
    CustomPromise.resolve(p).then(resolveHandler, rejectHandler)
  )
  return CustomPromise.all(covertedPromises)
}

export function allSettledMethod2(promiseList) {
  return new CustomPromise((resolve, reject) => {
    let length = promiseList.length
    let result = []
    let count = 0

    if (length === 0) {
      return resolve(result)
    }

    for (let i = 0; i < length; i++) {
      ;(function (i) {
        let currentPromise = CustomPromise.resolve(promiseList[i])

        currentPromise.then(
          (value) => {
            count++
            result[i] = {
              status: STATE.FULFILLED,
              value: value
            }
            if (count === length) {
              return resolve(result)
            }
          },
          (reason) => {
            count++
            result[i] = {
              status: STATE.REJECTED,
              reason: reason
            }
            if (count === length) {
              return resolve(result)
            }
          }
        )
      })(i)
    }
  })
}

export function anyMethod(promiseList) {
  return new CustomPromise((resolve, reject) => {
    const errors = []
    const len = promiseList.length

    promiseList.forEach((promise) => {
      CustomPromise.resolve(promise).then(
        (value) => {
          resolve(value)
        },
        (reason) => {
          errors.push(new Error(reason))
          if (errors.length === len) {
            const error = new AggregateError(errors)
            reject(error)
          }
        }
      )
    })
  })
}
