const MyPromise = require('./myPromise')

function p2 () {
  return new MyPromise((resolve, reject) => {
    // resolve('成功')
    reject('失败')
  })
}

p2()
  .then(value => console.log(value))
  .catch(reason => console.log(reason))