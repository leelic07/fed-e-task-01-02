# fed-e-task-01-02
fed-e-task-01-02

简答题
一、谈谈你是如何理解JS异步编程的，EventLoop、消息队列都是做什么的，什么是宏任务，什么是微任务？
>EVENT LOOP 指的是javascript的事件循环，用来监听执行栈和消息队列，当执行栈的任务执行完毕的时候，事件循环会将消息队列中的任务压入到执行栈中依次执行。

>消息队列用来存放JS主线程执行过程中的一些异步操作，当JS主线程的任务执行完毕之后，会将消息队列中的任务一次压入执行栈执行。

>微任务：包括 Promise、process.nextTick 等操作，是在主线程任务执行完毕之后执行的任务，当执行主线程任务的时候遇上了微任务，会先将微任务压入到微任务队列中，等待主线程的任务都执行完毕之后，再在微任务队列中依次执行队列中的微任务。

>宏任务：包括setTimeout、setInterval、setImmediate、I/O、UI 等操作，但主线程的任务和微任务的队列都执行完毕后才执行的任务，当主线程遇上了宏任务的时候先将宏任务压入到宏任务的队列当中，等到主线程和微任务队列中的任务都依次执行完毕之后，才会依次执行宏任务队列中的任务。

代码题目
一、将下面异步代码使用Promise的方式进行改进
```
setTimeout(function() {
  var a = 'hello'
  setTimeout(function() {
    var b = 'lagou'
    setTimeout(functin() {
      var c = 'I ❤ U'
    },10)
  },10)
},10)
```
答案：
```
Promise.resolve('hello')
.then(res => res + 'lagou')
.then(res => res + 'I ❤ U')
.then(res => console.log(res))
```

二、基于一下代码完成下面的四个练习
练习1、使用函数组合fp.flowRight()重新实现下面这个函数
```
let isLastInStock = function(cars) {
  // 获取最后一条数据
  let last_car = fp.last(cars)
  // 获取最后一条数据的 in_stock 属性值
  return fp.prop('in_stock', last_car)
}
```
答案：
```
let isLastInStock = function(cars) {
  return fp.flowRight(fp.prop('in_stock'), fp.last)(cars)
}
```

练习2、使用fp.flowRight()、fp.prop和fp.first()获取第一个car的name
答案：
```
let isFirstName = function(cars) {
  reutrn fp.flowRight(fp.prop('name'), fp.first)(cars)
}
```

练习3、使用帮助函数_average重构averageDollarValue，使用函数组合的方式实现
```
let _average = function(xs) {
  return fp.reduce(fp.add, 0, xs) / xs.length
}

let averageDollarValue = function(cars) {
  let dollar_values = fp.map(function(car) {
    return car.dollar_value
  }, cars)
  return _average(dollar_values)
}
```
答案：
```
let averageDollarValue = function(cars) {
  return fp.flowRight(_average, fp.map(function(car) { return car.dollar_value }))(cars)
}
```

练习4、使用flowRight写一个sanitizeNames()函数、返回一个下划线链接的小写字符串，把数组中的name转换为这种形式：例如：
sanitizeNames(['HELLO WORLD']) => ['hello_world']
```
let _underscore = fp.replace(/\W+/g, '_') // <-- 无需改动，并且在sanitizeNames中使用它
```
答案：
```
const transform = function (str) {
  return fp.flowRight(fp.split('*'), _underscore, fp.toLower, fp.join('*'))(str)
}
```

三、基于下面的代码，完成后续的四个练习
练习1：使用fp.add(x, y)和fp.map(f, x)，创建一个能让functor里面的值增加的函数ex1
```
const fp = require('lodash/fp')
const {Maybe, Container} = './supprot'

let maybe = Maybe.of([5, 6, 1])
let ex1 = (y) => {
  maybe.map(fp.map(functin(x) {
    return fp.add(x, y)
  }))
}
```

练习2：实现一个函数ex2，能够使用fp.first获取列表的第一个元素
```
const fp = require('lodash/fp')
const {Maybe, Container} = './supprot'

let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
let ex2 = () => {
  xs.map(fp.first)
}
```

练习3：实现一个函数ex3，使用safeProp和fp.first找到user的名字的首字母
```
const fp = require('lodash/fp')
const {Maybe, Container} = './supprot'

let safeProp = fp.curry(function(x ,o) {
  return Maybe.of(o[x])
})
let user = { id: 2, name: 'Albert' }
let ex3 = () => {
  safeProp('name', user).map(fp.first)
}
```

练习4：使用Maybe重写ex4，不要有if语句
```
const fp = require('lodash/fp')
const {Maybe, Container} = './supprot'

let ex4 = function (n) {
  return Maybe.of(n).map(x => parseInt(x))._value
}
```

四、手写实现MyPromise源码
要求：尽可能还原Promise中的每一个API，并通过注释的方式描述思路和原理
```
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
        // 异步执行成功的回调函数 是为了当调用resolvePromise函数时 promise2已经完成赋值
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
      // 如果callback中存在异步操作 则等待异步操作执行完毕之后再返回结果 否则直接返回结构value
      return MyPromise.resolve(callback()).then(() => value)
    }, reason => {
      // 等待callback函数执行完毕之后再抛出异常
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
        // 等待所有的结果都返回完毕之后 再调用MyPromise的resolve方法返回all方法的结果
        if (index === array.length) {
          resolve(result)
        }
      }
      for (let i = 0; i < array.length; i++) {
        // 如果是MyPromise对象 等待MyPromise对象执行完毕之后再压入结果集中
        if (array[ i ] instanceof MyPromise) {
          array[ i ].then(value => addData(i, value), reason => reject(reason))
        // 如果是普通值则直接压入到结果集中
        } else {
          addData(i, array[ i ])
        }
      }
    })
  }

  static resolve (value) {
    // 如果时MyPromise对象的实例则直接返回
    if (value instanceof MyPromise) return value
    // 如果是普通值的话则创建一个MyPromise对象的实例 然后将返回值作为下一个MyPromise对象成功时的值返回
    return new MyPromise(resolve => resolve(value))
  }

}

// 处理resolve的返回值
function resolvePromise (promise, x, resolve, reject) {
  // 如果resolve返回的值就是当前的Promise对象 则抛出异常
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

module.exports = MyPromise
```