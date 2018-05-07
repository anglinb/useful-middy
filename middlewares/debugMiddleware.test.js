const debug = require('debug')
const middy = require('middy')
const debugMiddleware = require('./debugMiddleware')
const stripColor = require('strip-color');

const trim = (str) => {
  return str.trim()
}

describe('debugMiddleware', () => {

  let previousDebugSetting
  beforeEach(() => {
    process.env.DEBUG_HIDE_DATE = true
    previousDebugSetting = process.env.DEBUG
    debug.enable('*');
  })


  afterEach(() => {
    debug.disable()
    debug.enable(previousDebugSetting)
  })

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

  it('should provide defaults', () => {

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
      .use(debugMiddleware())

    wrappedHandler({}, null, (err, resp) => {
      expect(err).toBe(null)
      expect(resp.statusCode).toBe(200)
    })

    expect(debuggedLines.map(stripColor).map(trim)).toEqual([
      "lambda:debug:unknownRequestId yo dawg",
      "lambda:debug:unknownRequestId this should be prefixed too!",
    ].map(trim))
  })
})
