const PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected'

class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject)
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
    while (this.fulfilledCallback.length) this.fulfilledCallback.shift()(value)
  }

  reject = (reason) => {
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    while (this.rejectedCallback.length) this.rejectedCallback.shift()(reason)
  }

  then(fulfilledCallback, rejectedCallback) {
    // 如果状态已经是成功
    if (this.status === FULFILLED) {
      fulfilledCallback(this.value)
      // 如果状态是失败
    } else if (this.status === REJECTED) {
      rejectedCallback(this.reason)
      // 如果状态依然是pending
    } else {
      this.fulfilledCallback.push(fulfilledCallback)
      this.rejectedCallback.push(rejectedCallback)
    }
  }
}

const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 3000);
  // reject('失败')
})

promise.then((value) => console.log(value), reason => console.log(reason))

module.exports = MyPromise