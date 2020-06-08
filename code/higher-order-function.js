// once 
function once (fn) {
  let done = false
  return function () {
    if (!done) {
      done = true
      fn.apply(this, arguments)
    }
  }
}

const pay = once(function (money) { console.log(`支付了：${money}`) })

pay(5)
pay(5)
pay(5)