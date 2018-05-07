const withDefaults = (obj, defaults) => {
  return (userConfig) => {
    let config = Object.assign({}, defaults, userConfig)
    return obj(config)
  }
}

module.exports = withDefaults
