const fp = require('lodash/fp')

const f = fp.flowRight(fp.join('-'), fp.map(item => fp.toLower(item)), fp.split(' '))

console.log(f('Hello World'))