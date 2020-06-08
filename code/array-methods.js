// map
const map = (array, fn) => {
  const results = []
  for (const item of array) {
    results.push(fn(item))
  }
  return results
}

let arr = [ 1, 2, 3, 4 ]
console.log(map(arr, v => v * v))

// every
const every = (array, fn) => {
  let result = true
  for (const item of array) {
    result = fn(item)
    if (!result) break
  }
  return result
}

let ar = [ 11, 12, 13 ]
console.log(every(ar, v => v > 10))

// some
const some = (array, fn) => {
  let result = false
  for (const item of array) {
    result = fn(item)
    if (result) break
  }
  return result
}

let a = [ 1, 3, 4, 9 ]
console.log(some(a, v => v % 2 === 0))