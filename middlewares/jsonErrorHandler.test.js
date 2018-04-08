const middy = require('middy')
const createError = require('http-errors')
const jsonErrorHandler = require('./jsonErrorHandler')

describe('jsonErrorHandler', () => {
  it('should create a response for HTTP errors', () => {
    const handler = middy((event, context, cb) => {
      throw new createError.UnprocessableEntity()
    })

    handler
      .use(jsonErrorHandler())

    // run the handler
    handler({}, {}, (_, response) => {
      expect(response).toEqual({
        statusCode: 422,
        body: JSON.stringify({ error: 'Unprocessable Entity' })
      })
    })
  })

  it('should NOT handle non HTTP errors', () => {
    const handler = middy((event, context, cb) => {
      throw new Error('non-http error')
    })

    handler
      .use(jsonErrorHandler())

    // run the handler
    handler({}, {}, (error, response) => {
      expect(response).toBe(undefined)
      expect(error.message).toEqual('non-http error')
    })
  })
})