require('dotenv').config();

const Koa = require('koa');
const app = new Koa();
const helmet = require('koa-helmet');

const api = require('./src/api');
const errorMiddleware = require('./src/api/middlewares/error');

app
  .use(errorMiddleware)
  .use(helmet())
  .use(api.routes())
  .use(api.allowedMethods());

module.exports = app;
