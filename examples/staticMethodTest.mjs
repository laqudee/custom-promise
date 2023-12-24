import CustomPromise from '../dist/index.mjs'
import fetch from 'node-fetch'

CustomPromise.all([
  new CustomPromise((resolve) => setTimeout(() => resolve(1), 3000)), // 1
  new CustomPromise((resolve) => setTimeout(() => resolve(2), 2000)), // 2
  new CustomPromise((resolve) => setTimeout(() => resolve(3), 1000)) // 3
]).then(console.log)

async function runResolve() {
  const res = await fetch(`https://api.github.com/users/remy`)
  return CustomPromise.resolve(res)
}
runResolve().then((response) => {
  console.log(`${response.url}: ${response.status}`)
})

let names = ['iliakan', 'remy', 'jeresig']

let requests = names.map((name) => fetch(`https://api.github.com/users/${name}`))

CustomPromise.all(requests)
  .then((responses) => {
    for (let response of responses) {
      console.log(`${response.url}: ${response.status}`)
    }

    return responses
  })
  .then((responses) => CustomPromise.all(responses.map((r) => r.json())))
  .then((users) => users.forEach((user) => console.log(user.name)))

/**
 * @description Use CustomPromise.any API
 *
 */
CustomPromise.any([
  new CustomPromise((resolve, reject) => setTimeout(() => reject(new Error('Whoops!')), 1000)),
  new CustomPromise((resolve, reject) => setTimeout(() => resolve(1), 2000)),
  new CustomPromise((resolve, reject) => setTimeout(() => resolve(3), 3000))
]).then((val) => {
  console.log('any-success-val: ', val)
}) // 1

CustomPromise.any([
  new CustomPromise((resolve, reject) => setTimeout(() => reject(new Error('Ouch!')), 1000)),
  new CustomPromise((resolve, reject) => setTimeout(() => reject(new Error('Error!')), 2000))
]).catch((error) => {
  // console.log('any-all reject-error: ', error);
  console.log('name:', error.constructor.name) // AggregateError
  console.log(error.errors[0]) // Error: Ouch!
  console.log(error.errors[1]) // Error: Error!
})
