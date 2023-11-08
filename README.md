# Custom Promise

Implement a custom Promise in JavaScript

> [Reference Shubham Khatri](https://medium.com/nerd-for-tech/implement-your-own-promises-in-javascript-68ddaa6a5409)

## Usage

### Installation

```sh
pnpm add @laqudee/custom-promise
```

### examples

```json
{
  "name": "custom-promise-test",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  //   "type": "module",  // if add type: module; test:cjs can't work
  "scripts": {
    "test": "node src/test.es.js",
    "test:es": "node src/test.es.mjs",
    "test:cjs": "node src/test.cjs.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@laqudee/custom-promise": "^1.0.0"
  }
}
```

```js
// for cjs test.cjs.js
const CustomPromise = require('custom-promise')

// for es test.es.js with type: module(in package.json) or test.es.mjs
import CustomPromise from 'custom-promise'
```

## Local Development

```sh
# build
pnpm build
```

```sh
# link fro global
pnpm link --global

# when use custom-promise
pnpm link --global @laqudee/custom-promise

# test
pnpm test:es
pnpm test:cjs
```

### Promises/A+ Compliance Test Suite

This suite tests compliance of a promise implementation with the Promises/A+ specification.

[Promises/A+ CTS](https://github.com/promises-aplus/promises-tests/blob/master/README.md)

- add `promise-aplus-tests`
```sh
pnpm add promises-aplus-tests -D
```

- add script cammand
```json
"scripts": {
  "test": "promises-aplus-tests promise-a-plus-test.js"
}
```

- run test
```sh
pnpm test
```

> This lib is temporarily uninstalled because it uses an older version of mocha that is causing some security issues. You can use this lib locally to test custom promises, but make sure it is uninstalled when you publish your own repository or npm package.

- [NPM or Github complains about security issues](https://github.com/promises-aplus/promises-tests/issues/94)

### `pnpm dev` Instructions

- `pnpm dev` will use `node` and [`esm`](https://www.npmjs.com/package/esm) execute the `src/index.js` file.

## Implement Process

### States, Handlers and value

- States:

  - Pending
  - Fulfilled
  - Rejected

- Handlers

  - then()
  - catch()
  - finally()

- value
  - resolve() return value
  - reject() return reason

### Start Coding

> A Promise is executed as soon as it is created, so callback function will be called inside the constructor with reject and resolve methods passed as paramenters to it.

#### Defining the skeleton

- following properties are defined in constructor

  - state
  - handlers
  - value

- following methods are defined in class
  - `_resolve()`
  - `_reject()`
  - `then()`
  - `catch()`
  - `finally()`

#### `_resolve()` and `_reject()` method implementation

- `_resolve()` method is set the state to `fulfilled` and the value to the resolved value.
- `_reject()` method is set the state to `rejected` and the value to the rejected reason.

> [What is Thenable Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#thenables)

#### `then()` method implementation

- `then()` method has two parameters

  - onFulfilled (onSuccess)
  - onRejected (onFail)

- onFulfilled (onSuccess) is called when the promise is fulfilled
- onRejected (onFail) is called when the promise is rejected

- The essence of `Promise chaining` is that the `then()` method

  - `then()` returns a new Promise object

- Callbacks passed by `then()` are stored in `handlers` array using addHandlers().

#### `catch()` and `finally()` method implementation

- `catch()` is implemented using `then()`method with `onSuccess` callback as null.

```
catch(onFail) {
    return this.then(null, onFail)
}
```

- `finally()` method returns a Promise which will be settled with previous fulfilled or rejected value.

### To be continued...
