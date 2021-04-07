module.exports = function (input) {
  require('./spawn')(input)
  require('../basic/renew')(input.host)
  require('./clone')(input.host)
}
