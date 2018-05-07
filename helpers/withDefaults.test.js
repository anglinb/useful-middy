const withDefaults = require('./withDefaults')

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

  it('should return a object with defaults', () => {
    let defaults = {
      a: 'b',
      c: 'd'
    }
    let funcFactory = (config) => {
      expect(config).toEqual(defaults)
      return {}
    }
    let defaultedFuncFactory = withDefaults(funcFactory, defaults)
    let func = defaultedFuncFactory()
  })
})
