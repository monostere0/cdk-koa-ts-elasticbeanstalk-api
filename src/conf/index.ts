import packageJson from '../../package.json';

interface AppConfig {
  port: number,
  test_port: number,
  cloudwatch_log_group: string,
  cloudwatch_log_stream: string,
  GIT_COMMIT: string,
  VERSION: string,
  ENVIRONMENT: string,
  AWS_REGION: string,
};

function conf(): AppConfig {
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

export default conf;