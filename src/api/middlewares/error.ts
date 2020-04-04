import logger from '../../logger';
import Koa from 'koa';

async function errorMiddleware(ctx: Koa.Context, next: Koa.Next): Promise<void> {
  try {
    await next();
  } catch (error) {
    logger.error(error);
    ctx.status = error.status || 500;
    ctx.body = error.message;
    ctx.app.emit('error', error, ctx);
  }
}

export default errorMiddleware;
