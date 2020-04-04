import Router from 'koa-router';

import entry from './routes/index';
import healthCheck from './routes/healthcheck';

const router = new Router();

router.get('/', entry);
router.get('/healthcheck', healthCheck);

export default router;
