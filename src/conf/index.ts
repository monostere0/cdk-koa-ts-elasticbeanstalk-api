import packageJson from '../../package.json';

interface EnvConfig {
  GIT_COMMIT: string;
  VERSION: string;
  ENVIRONMENT: string;
  AWS_REGION: string;
}

interface AppConfig {
  port: number;
  test_port: number;
  cloudwatch_log_group: string;
  cloudwatch_log_stream: string;
};

function getEnvConfig(): EnvConfig {
  return {
    GIT_COMMIT: process.env.CIRCLE_SHA1,
    VERSION: packageJson.version,
    ENVIRONMENT: process.env.ENVIRONMENT,
    AWS_REGION: process.env.AWS_REGION,
  };
}

function conf(): AppConfig & EnvConfig {
  const env = process.env.NODE_ENV;
  const config = require(`./${(env || 'default')}`).default;
  const defaultConfig = env ? require('./default').default : {};
  return Object.assign({}, defaultConfig, config, getEnvConfig());
};

export default conf;
