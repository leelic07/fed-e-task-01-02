const MyPromise = require('./myPromise')

function p1 () {
  return new MyPromise(resolve => {
    setTimeout(() => {
      resolve('p1 resolve')
    }, 2000)
  })
}

function p2 () {
  return new MyPromise(resolve => {
    resolve('p2 resolve')
  })
}


p2().finally(() => {
  console.log('finally')
  return p1()
}).then(value => console.log(value), reason => console.log(reason))