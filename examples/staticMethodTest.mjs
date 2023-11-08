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
