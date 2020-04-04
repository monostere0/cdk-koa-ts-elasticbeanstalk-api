import Koa from 'koa';

async function entryPoint(ctx: Koa.Context) {
  ctx.body = 'API Entry point';
}

export default entryPoint;