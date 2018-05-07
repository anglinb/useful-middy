'use strict';

const debug = require('debug')('handlers:hello')
const middy = require('middy')

const {
  jsonBodyParser,
  jsonErrorHandler,
  ignoreCaseHeaders,
} = require('./useful-middy')

const hello = async (event, context) => {
  const name = event.body.name

  let message
  if (name !== undefined)
  {
    message = `Hello, ${name}!`
  }
  else
  {
    message = 'Whoops! Trying setting the name key in the json. Ex: {"name": "Brian"}'
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message,
    }),
  };

  return response
};

module.exports.hello = middy(hello)
  .use(jsonBodyParser())
  .use(jsonErrorHandler())
