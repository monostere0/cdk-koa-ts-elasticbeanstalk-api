const cdk = require('@aws-cdk/core');

const ElasticBeanStalkStack = require('./elasticbeanstalk');
const S3DeployStack = require('./s3-deploy');
const Route53Stack = require('./route53');
const CloudWatchDashboardStack = require('./dashboard');
const constants = require('./constants');

const app = new cdk.App();

const s3Deploy = new S3DeployStack(app, constants.S3_STACK_NAME, {
  stackName: constants.S3_STACK_NAME,
  env: { region: constants.AWS_REGION },
});
const elasticBeanStalkStack = new ElasticBeanStalkStack(app, constants.ELASTICBEANSTALK_STACK_NAME, {
  bucket: s3Deploy.bucket,
  stackName: constants.ELASTICBEANSTALK_STACK_NAME,
  env: { region: constants.AWS_REGION },
});
new Route53Stack(app, constants.ROUTE53_STACK_NAME, {
  stackName: constants.ROUTE53_STACK_NAME,
  elbUrl: elasticBeanStalkStack.stackUrl,
  env: { region: constants.AWS_REGION },
});
new CloudWatchDashboardStack(app, 'ApiCloudWatchDashboardStack', {
  stackName: 'ApiCloudWatchDashboardStack',
  env: { region: constants.AWS_REGION },
});

app.synth();
