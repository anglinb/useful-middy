const debug = require('debug')('middleware:jsonErrorHandler')
const { HttpError } = require('http-errors')

module.exports = ({ exposeErrorKeys = false } = {}) => ({
  onError: (handler, next) => {
    debug('Got error: %o', handler.error)
    if (handler.error instanceof HttpError) {

      let resp = { error: handler.error.message }
      debug('preparing response: %o', resp)
      if (handler.error.details) {
        debug('got details: %o', handler.error.details)
        resp.errorDetails = handler.error.details
      }

      // TODO: Allow enabling exposeErrorKeys
      // Custom error key
      // resp.errorKey = handler.error.errorKey || 'unknown_error'

      handler.response = {
        statusCode: handler.error.statusCode,
        body: JSON.stringify(resp)
      }
      return next()
    }
    debug('Unknown error, passing to next: %o', handler.error)
    return next(handler.error)
  }
})