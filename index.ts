import conf from './src/conf';
import app from './src/app';
import logger from './src/logger';

app.listen(conf().port, () => {
  logger.debug('tech-gigs-api started at port', conf.port);
});
