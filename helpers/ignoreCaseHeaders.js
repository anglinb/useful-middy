module.exports = (headers) => {
  const lowercasedHeaders = {}
  for (const key in headers) {
    lowercasedHeaders[key.toLowerCase()] = headers[key]
  }
  const get = (headerName) => {
    return lowercasedHeaders[headerName.toLowerCase()]
  }
  return {
    get
  }
}