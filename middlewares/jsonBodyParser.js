const debug = require('debug')('middleware:jsonBodyParser')
const createError = require('http-errors')
const contentType = require('content-type')

const ignoreCaseHeaders = require('../helpers/ignoreCaseHeaders')

module.exports = () => ({

  before: (handler, next) => {
    const headers = ignoreCaseHeaders(handler.event.headers)

    // Ensure headers
    if (!headers.get('Content-Type')) {
      debug('Content Type Issues: %o', handler.event.headers)
      let httpError = createError(422, `Please ensure the the 'Content-Type' header is set to 'application/json'`, { errorKey: 'invalid_json_header'})
      throw httpError
    }

    // Ensure content type
    const { type } = contentType.parse(headers.get('Content-Type'))
    if (type !== 'application/json') {
      debug('Headers: %o', handler.event.headers)
      debug('Got type %s, was expecting \'application/json\'', type)
      let httpError = createError(422, `Please ensure the the 'Content-Type' header is set to 'application/json'`, { errorKey: 'invalid_json_header'})
      throw httpError
    }
 
    // Parse body
    try {
      handler.event.body = JSON.parse(handler.event.body)
    } catch (err) {
      debug('error decoding json: %o', err)
      let httpError = createError(422, 'Content type defined as JSON but an invalid JSON was provided: ' + err.message, { errorKey: 'invalid_json'})
      throw httpError
    }
    next()
  }
})