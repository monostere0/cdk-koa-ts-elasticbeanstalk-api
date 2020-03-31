const Router = require('koa-router');

const router = new Router();

router.get('/', require('./routes/index'));
router.get('/healthcheck', require('./routes/healthcheck'));

module.exports = router;
