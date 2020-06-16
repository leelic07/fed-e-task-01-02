const fs = require('fs')
const fp = require('lodash/fp')

class IO {
  constructor(value) {
    this._value = value
  }

  static of (value) {
    return new IO(function () {
      return value
    })
  }

  map (fn) {
    return new IO(fp.flowRight(fn, this._value))
  }

  join () {
    return this._value()
  }

  flatMap (fn) {
    return this.map(fn).join()
  }
}

const readFile = filename => {
  return new IO(function () {
    return fs.readFileSync(filename, 'utf-8')
  })
}

const print = x => {
  return new IO(function () {
    console.log(x)
    return x
  })
}

const r = readFile('../package.json')
  .map(fp.toUpper)
  .flatMap(print)
  .join()

console.log(r)