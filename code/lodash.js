const _ = require('lodash')
const { log } = console

const array = [ 'jack', 'tom', 'lucy', 'kate' ]

log(_.first(array))
log(_.last(array))
log(_.toUpper(_.first(array)))
log(_.reverse(array))

const result = _.each(array, (item, index) => {
  log(item, index)
})

log(result)