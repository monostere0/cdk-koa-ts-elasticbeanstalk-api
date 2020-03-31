const conf = require('./conf')();
const app = require('./app');
const logger = require('./logger');

app.listen(conf.port, () => {
  logger.debug('tech-gigs-api started at port', conf.port);
});
