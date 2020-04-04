import conf from './src/conf';
import app from './src/app';
import logger from './src/logger';

app.listen(conf().port, () => {
  logger.info('tech-gigs-api started at port', conf().port);
});
