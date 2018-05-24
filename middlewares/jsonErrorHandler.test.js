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

  describe('errorKeys', () => {

    it('should default to off', () => {
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

    it('should add the error key property when no error key is present', () => {
      const handler = middy((event, context, cb) => {
        throw new createError.UnprocessableEntity()
      })

      handler
        .use(jsonErrorHandler({ exposeErrorKeys: true }))

      // run the handler
      handler({}, {}, (_, response) => {
        expect(response).toEqual({
          statusCode: 422,
          body: JSON.stringify({ error: 'Unprocessable Entity', error_key: 'unknown_error' })
        })
      })
    })
    it('should add the correct error key', () => {
      const handler = middy((event, context, cb) => {
        let err = new createError.UnprocessableEntity()
        err.errorKey = 'my_key_error'
        throw err
      })

      handler
        .use(jsonErrorHandler({ exposeErrorKeys: true }))

      // run the handler
      handler({}, {}, (_, response) => {
        expect(response).toEqual({
          statusCode: 422,
          body: JSON.stringify({ error: 'Unprocessable Entity', error_key: 'my_key_error' })
        })
      })
    })
  })
})