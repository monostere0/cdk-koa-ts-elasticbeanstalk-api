import dotenv from 'dotenv';
import Koa from 'koa';
import koaLogger from 'koa-logger';
import logger from './logger';
import helmet from 'koa-helmet';
import jwt from 'koa-jwt';

dotenv.config();

const app = new Koa();

import api from './api';
import errorMiddleware from './api/middlewares/error';

function logRequestInfo(_: string, args: Object) {
  logger.info({
    type: args[0].includes('<') ? 'request' : 'response',
    method: args[1],
    path: args[2],
    responseCode: args[3],
    responseTime: args[4],
    responseSize: args[5],
  });
}

app
  .use(jwt({ secret: 'shared-secret' }).unless({ path: [/^\//] }))
  .use(koaLogger({ transporter: logRequestInfo }))
  .use(errorMiddleware)
  .use(helmet())
  .use(api.routes())
  .use(api.allowedMethods());

export default app;
