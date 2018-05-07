const debugFactory = require('debug')

module.exports = ({debugPrefix = 'lambda:debug'} = {}) => ({
  before: (handler, next) => {
    const requestId = (handler.event.requestContext || {}).requestId || 'unknownRequestId'
    const debug = debugFactory(`${debugPrefix}:${requestId}`)
    handler.event.debug = debug
    next()
  }
})
