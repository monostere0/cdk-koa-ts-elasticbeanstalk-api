import Koa from 'koa';
import conf from '../../conf';

async function healthCheck(ctx: Koa.Context): Promise<void> {
  const timeInMs = new Date().getTime();
  ctx.body = {
    commit: conf().GIT_COMMIT,
    app_version: conf().VERSION,
    generated_at: new Date(timeInMs).toISOString(),
    started_at: new Date(timeInMs - process.uptime()).toISOString(),
    duration_ms: Date.now() - timeInMs,
  };
};

export default healthCheck;
