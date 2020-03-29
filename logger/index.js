const bunyan = require('bunyan');
const LogzioBunyanStream = require('logzio-bunyan');

const packageJson = require('../package.json');

const loggerOptions = {
  token: process.env.LOGZIO_ACCESS_TOKEN,
};

module.exports = bunyan.createLogger({
  name: packageJson.name,
  streams: [
    {
      type: 'raw',
      stream: new LogzioBunyanStream(loggerOptions),
    },
  ],
});
