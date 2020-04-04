import Koa from 'koa';

async function entryPoint(ctx: Koa.Context): Promise<void> {
  ctx.body = 'API Entry point';
}

export default entryPoint;
