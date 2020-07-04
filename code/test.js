const fp = require('lodash/fp')
// var a = []
// for (let i = 0; i < 10; i++) {
//   a[i] = function() {
//     console.log(i)
//   }
// }
// a[6]()

// var tmp = 123
// if (true) {
//   console.log(tmp)
//   let tmp
// }

// var arr = [ 12, 34, 32, 89, 4 ]

// console.log(arr.sort((i, j) => i - j)[ 0 ])

// console.log(Math.min(...arr))

// const cars = [ { in_stock: '100', dollar_value: 10000 }, { in_stock: 200, dollar_value: 15000 } ]

// let isLastInStock = function (cars) {
//   return fp.flowRight(fp.prop('in_stock'), fp.last)(cars)
// }

// console.log(isLastInStock(cars))

// let _average = function (xs) {
//   return fp.reduce(fp.add, 0, xs) / xs.length
// }

// let averageDollarValue = function (cars) {
//   return fp.flowRight(_average, fp.map(function (car) { return car.dollar_value }))(cars)
// }

// console.log(averageDollarValue(cars))

let _underscore = fp.replace(/\W+/g, '_')

const transform = function (str) {
  return fp.flowRight(fp.split('*'), _underscore, fp.toLower, fp.join('*'))(str)
}

console.log(transform([ 'HELLO WORLD' ]))