require('dotenv').config();

const Koa = require('koa');
const koaLogger = require('koa-logger');
const helmet = require('koa-helmet');
const jwt = require('koa-jwt');

const logger = require('./logger');
const api = require('./src/api');
const errorMiddleware = require('./src/api/middlewares/error');

const app = new Koa();

function logRequestInfo(_, args) {
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
  .use(jwt({ secret: 'shared-secret' }).unless({ path: [/^\/public/] }))
  .use(koaLogger({ transporter: logRequestInfo }))
  .use(errorMiddleware)
  .use(helmet())
  .use(api.routes())
  .use(api.allowedMethods());

module.exports = app;
