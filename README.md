# useful-middy

[![travis build](https://api.travis-ci.org/anglinb/useful-middy.svg?branch=master)](https://travis-ci.org/anglinb/useful-middy) 

A few useful [middy](https://github.com/middyjs/middy) middlewares that I rely on all over the place. 

## Getting Started

```bash
npm install
npm test
```


## Usage

```node
const { jsonBodyParser } = require('useful-middy')
const handler = middy(someHandler)
  .use(jsonBodyParser())

module.exports = { handler }
```
