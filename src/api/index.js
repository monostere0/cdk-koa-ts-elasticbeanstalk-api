const Router = require('koa-router');

const router = new Router({ prefix: '/' });

router.get('/', require('./routes/index'));

module.exports = router;
