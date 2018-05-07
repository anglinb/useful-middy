const middy = require('middy')
const createError = require('http-errors')

const debug = require('debug')
const stripColor = require('strip-color');

const trim = (str) => {
  return str.trim()
}

const {
  jsonBodyParser,
  jsonErrorHandler,
  ignoreCaseHeaders,
  withDefaults,
  debugMiddleware,
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

  describe('withDefaults', () => {
    it('should allow defaults to be overridden', () => {
      let defaults = {
        a: 'b',
        c: 'd',
      }
      let funcFactory = (config) => {
        expect(config).toEqual({
          a: 'b',
          c: 'z'
        })
        return {}
      }
      let defaultedFuncFactory = withDefaults(funcFactory, defaults)
      let func = defaultedFuncFactory({c: 'z'})
    })
  })
  describe('debugMiddleware', () => {

    let previousDebugSetting
    beforeEach(() => {
      previousDebugSetting = process.env.DEBUG
      debug.enable('*');
    })


    afterEach(() => {
      debug.disable()
      debug.enable(previousDebugSetting) })

    it('should provide a debug instance', () => {

      const debuggedLines = [];
      const debugCatcher = (str) => {
        debuggedLines.push(str)
      }

      const handler = (event, context, cb) => {
        let { debug } = event

        debug.log = debugCatcher
        process.env.DEBUG = "*"
        debug('yo dawg')
        debug('this should be prefixed too!')
        cb(null, {
          statusCode: 200,
          body: JSON.stringify({ "hello": "world" })
        })
      }
      let wrappedHandler = middy(handler)
        .use(debugMiddleware({ debugPrefix: '123' }))

      wrappedHandler({
        requestContext: {
          requestId: '123456'
        }
      }, null, (err, resp) => {
        expect(err).toBe(null)
        expect(resp.statusCode).toBe(200)
      })

      expect(debuggedLines.map(stripColor).map(trim)).toEqual([
        "123:123456 yo dawg",
        "123:123456 this should be prefixed too!",
      ].map(trim))
    })
  })
})

