const process = require('process');
const packageJson = require('../../package.json');

module.exports = function conf() {
  const env = process.env.NODE_ENV;
  const config = require(`./${(env || 'default')}.json`);
  const defaultConfig = env ? require('./default.json') : {};

  return Object.assign({}, defaultConfig, config, getEnvConfig());
};

function getEnvConfig() {
  return {
    GIT_COMMIT: process.env.CIRCLE_SHA1,
    VERSION: packageJson.version,
    ENVIRONMENT: process.env.ENVIRONMENT,
    AWS_REGION: process.env.AWS_REGION,
  };
}
