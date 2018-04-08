const ignoreCaseHeaders = require('./ignoreCaseHeaders')

describe('ignoreCaseHeaders', () => {
  describe('when headers exist', () => {
    it('should allow look ups of capitalized headers', () => {
      const headers = {
        'Content-Type': 'application/json',
        'Accept': '*'
      }
      const headerLookup = ignoreCaseHeaders(headers)
      expect(headerLookup.get('Content-Type')).toEqual('application/json')
      expect(headerLookup.get('content-type')).toEqual('application/json')
      expect(headerLookup.get('CONTENT-type')).toEqual('application/json')
      expect(headerLookup.get('accept')).toEqual('*')
      expect(headerLookup.get('Accept')).toEqual('*')
      expect(headerLookup.get('lfdkjs')).toBe(undefined)
    })
    it('should allow look ups of lowercased headers', () => {
      const headers = {
        'content-type': 'application/json',
        'accept': '*'
      }
      const headerLookup = ignoreCaseHeaders(headers)
      expect(headerLookup.get('Content-Type')).toEqual('application/json')
      expect(headerLookup.get('content-type')).toEqual('application/json')
      expect(headerLookup.get('CONTENT-type')).toEqual('application/json')
      expect(headerLookup.get('Accept')).toEqual('*')
      expect(headerLookup.get('lfdkjs')).toBe(undefined)
    })
  })
  describe('when no headers exists', () => {
    it('should always return undefined', () => {
      let headerLookup = ignoreCaseHeaders(undefined) 
      expect(headerLookup.get('Content-Type')).toBe(undefined)
      headerLookup = ignoreCaseHeaders(null) 
      expect(headerLookup.get('Content-Type')).toBe(undefined)
      headerLookup = ignoreCaseHeaders({}) 
      expect(headerLookup.get('Content-Type')).toBe(undefined)
    })
  })
})