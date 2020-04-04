module.exports = errorMiddleware;
const logger = require('../../logger');

async function errorMiddleware(ctx, next) {
  try {
    await next();
  } catch (error) {
    logger.error(error);
    ctx.status = error.status || 500;
    ctx.body = error.message;
    ctx.app.emit('error', error, ctx);
  }
}
