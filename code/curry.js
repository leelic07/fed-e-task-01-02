const { log } = console

const getSum = (a, b, c) => {
  return a + b + c
}

// 柯里化函数
function curry (fn) {
  return function curriedFn (...args) {
    // 如果实际参数小于形式参数
    if (args.length < fn.length) {
      return function () {
        return curriedFn(...args.concat(Array.from(arguments)))
      }
    }
    return fn(...args)
  }
}

const curried = curry(getSum)

log(curried(1, 2, 3))
log(curried(1)(2, 3))
log(curried(1, 2)(3))