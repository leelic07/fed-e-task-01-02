const MyPromise = require('./myPromise')

function p1 () {
  return new MyPromise(resolve => resolve('p1'))
}

function p2 () {
  return new MyPromise(resolve => {
    setTimeout(() => {
      resolve('p2')
    }, 2000)
  })
}

MyPromise.all([ 'a', 'b', p1(), 'c', p2() ]).then(res => console.log(res), reason => console.log(reason))