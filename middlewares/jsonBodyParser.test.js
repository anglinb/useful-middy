const middy = require('middy')
const jsonBodyParser = require('./jsonBodyParser')

describe('jsonBodyParser', () => {
  it('should parse a JSON request', () => {
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
    })
  })

  it('should handle invalid JSON as an UnprocessableEntity', () => {
    const handler = middy((event, context, cb) => {
      cb(null, event.body) // propagates the body as a response
    })

    handler.use(jsonBodyParser())

    // invokes the handler
    const event = {
      headers: {
        'Content-Type': 'application/json'
      },
      body: 'make it broken' + JSON.stringify({foo: 'bar'})
    }
    handler(event, {}, (err) => {
      expect(err.message).toEqual('Content type defined as JSON but an invalid JSON was provided: Unexpected token m in JSON at position 0')
      expect(err.errorKey).toEqual('invalid_json')
    })
  })

  it('should throw if the content type is not specified.', () => {
    const handler = middy((event, context, cb) => {
      cb(null, event.body) // propagates the body as a response
    })

    handler.use(jsonBodyParser())

    // invokes the handler
    const event = {
      body: JSON.stringify({foo: 'bar'})
    }
    handler(event, {}, (err) => {
      expect(err.message).toEqual('Please ensure the the \'Content-Type\' header is set to \'application/json\'')
      expect(err.errorKey).toEqual('invalid_json_header')
    })
  })
  it('should not care about case sensativity', () => {
    const handler = middy((event, context, cb) => {
      cb(null, event.body) // propagates the body as a response
    })

    handler.use(jsonBodyParser())

    // invokes the handler
    const event = {
      headers: {
        'contenT-Type': 'application/json'
      },
      body: JSON.stringify({foo: 'bar'})
    }
    handler(event, {}, (_, body) => {
      expect(body).toEqual({foo: 'bar'})
    })
  })
})
