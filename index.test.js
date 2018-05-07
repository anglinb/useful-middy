const middy = require('middy')
const createError = require('http-errors')

const {
  jsonBodyParser,
  jsonErrorHandler,
  ignoreCaseHeaders
} = require('./')

// I made a mistake about what modules I was exporting so I setup this smoke test
describe('exported modules', () => {
  describe('jsonBodyParser', () => {
    it('should parse the json body', (done) => {
      const handler = middy((event, context, cb) => {
        cb(null, event.body) // propagates the body as a response
      })

      handler.use(jsonBodyParser())

      // invokes the handler
      const event = {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({foo: 'bar'})
      }
      handler(event, {}, (_, body) => {
        expect(body).toEqual({foo: 'bar'})
        done()
      })
    })
  })
  describe('jsonErrorHandler', () => {
    it('should handle the error', () => {
      const handler = middy((event, context, cb) => {
        throw new createError.UnprocessableEntity()
      })

      handler
        .use(jsonErrorHandler())

      // run the handler
      handler({}, {}, (err, response) => {
        expect(response).toEqual({
          statusCode: 422,
          body: JSON.stringify({ error: 'Unprocessable Entity' })
        })
      })
    })
  })

  describe('ignoreCaseHeaders', () => {
    it('should ignore the case of headers', () => {
      let uncasedHeaders = ignoreCaseHeaders({'Aa': 'b'})
      expect(uncasedHeaders.get('aa')).toEqual('b')
    })
  })
})