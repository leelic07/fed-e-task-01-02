const PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected'

class MyPromise {
  constructor(executor) {
    // 捕获执行器函数的错误
    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }

  status = PENDING

  value

  reason

  fulfilledCallback = [] // 成功回调的队列

  rejectedCallback = [] // 失败回调的队列

  resolve = (value) => {
    if (this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    while (this.fulfilledCallback.length) this.fulfilledCallback.shift()()
  }

  reject = (reason) => {
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    while (this.rejectedCallback.length) this.rejectedCallback.shift()()
  }

  then(fulfilledCallback, rejectedCallback) {
    const promise2 = new MyPromise((resolve, reject) => {
      // 一下是同步的情况处理
      // 如果状态已经是成功
      if (this.status === FULFILLED) {
        try {
          const x = fulfilledCallback(this.value)
          resolvePromise(promise, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
        // 如果状态是失败
      } else if (this.status === REJECTED) {
        try {
          const x = rejectedCallback(this.reason)
          resolvePromise(promise, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
        // 以下是异步的情况处理
        // 如果状态依然是pending
      } else {
        this.fulfilledCallback.push(() => {
          try {
            const x = fulfilledCallback(this.value)
            resolvePromise(promise, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
        this.rejectedCallback.push(() => {
          try {
            const x = rejectedCallback(this.reason)
            resolvePromise(promise, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
    })
    return promise2
  }

}

// 处理resolve的返回值
function resolvePromise(promise, x, resolve, reject) {
  // 如果resolve返回的值就是当前的Promise对象
  if (promise === x) {
    return reject(new TypeError('in circle promise'))
  }
  // 如果x是MyPromise的实例
  if (x instanceof MyPromise) {
    x.then(resolve, reject)
    // 如果是普通的值 直接传给下一个promise的then方法
  } else {
    resolve(x)
  }
}

const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
    // throw new Error('delay error')
  }, 3000);
  // reject('失败')
})

const task = () => {
  return new MyPromise((resolve, reject) => {
    // reject(new Error('promise error'))
    resolve(123)
  })
}


promise.then((value) => {
  console.log(value)
  throw new Error('hahaha error')
  return task()
  // return 1000
}, reason => {
  console.log('hahahaha', reason)
}).then(value => {
  console.log(value)
}, reason => {
  console.log('aaaaaaa', reason)
})

module.exports = MyPromise