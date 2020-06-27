const PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected'

class MyPromise {
  constructor(executor) {
    this.value = ""
    this.reason = ""
    this.status = PENDING // promise的状态
    this.fulfilledCallback = [] // 成功回调的队列
    this.rejectedCallback = [] // 失败回调的队列
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
    // 捕获执行器函数的错误
    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }

  resolve (value) {
    if (this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    while (this.fulfilledCallback.length) this.fulfilledCallback.shift()()
  }

  reject (reason) {
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    while (this.rejectedCallback.length) this.rejectedCallback.shift()()
  }

  then (fulfilledCallback, rejectedCallback) {
    const promise2 = new MyPromise((resolve, reject) => {
      rejectedCallback = rejectedCallback || function (value) { return value }
      fulfilledCallback = fulfilledCallback || function (reason) { throw reason }
      // 一下是同步的情况处理
      // 如果状态已经是成功
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            const x = fulfilledCallback(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
        // 如果状态是失败
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            const x = rejectedCallback(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
        // 以下是异步的情况处理
        // 如果状态依然是pending
      } else {
        this.fulfilledCallback.push(() => {
          try {
            const x = fulfilledCallback(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
        this.rejectedCallback.push(() => {
          try {
            const x = rejectedCallback(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
    })
    return promise2
  }

  finally (callback) {
    return this.then(value => {
      return MyPromise.resolve(callback()).then(() => value)
    }, reason => {
      return MyPromise.resolve(callback()).then(() => { throw reason })
    })
  }

  catch (failCallback) {
    return this.then(undefined, failCallback)
  }

  static all (array) {
    const result = []
    let index = 0
    return new MyPromise((resolve, reject) => {
      function addData (key, value) {
        result[ key ] = value
        index++
        if (index === array.length) {
          resolve(result)
        }
      }
      for (let i = 0; i < array.length; i++) {
        if (array[ i ] instanceof MyPromise) {
          array[ i ].then(value => addData(i, value), reason => reject(reason))
        } else {
          addData(i, array[ i ])
        }
      }
    })
  }

  static resolve (value) {
    if (value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
  }

}

// 处理resolve的返回值
function resolvePromise (promise, x, resolve, reject) {
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

// const promise = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('成功')
//     // throw new Error('delay error')
//   }, 3000);
//   // reject('失败')
// })

// const task = () => {
//   return new MyPromise((resolve, reject) => {
//     // reject(new Error('promise error'))
//     resolve(123)
//   })
// }


// promise.then((value) => {
//   console.log(value)
//   throw new Error('hahaha error')
//   return task()
//   // return 1000
// }, reason => {
//   console.log('hahahaha', reason)
// }).then(value => {
//   console.log(value)
// }, reason => {
//   console.log('aaaaaaa', reason)
// })

// MyPromise.resolve(100).then(value => console.log(value))

module.exports = MyPromise