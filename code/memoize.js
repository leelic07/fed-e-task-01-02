const { log } = console

// 计算圆的面积
function getArea (r) {
  console.log(r)
  return Math.PI * r * r
}

const memoize = function (fn) {
  const cache = {}
  return function () {
    const key = JSON.stringify(arguments)
    cache[ key ] = cache[ key ] || fn.apply(fn, arguments) // 如果cache中有对应参数的缓存，直接返回缓存中的值。否则返回函数的执行结果
    return cache[ key ]
  }
}

const getAreaWithMemory = memoize(getArea)

log(getAreaWithMemory(4))
log(getAreaWithMemory(4))
log(getAreaWithMemory(4))

