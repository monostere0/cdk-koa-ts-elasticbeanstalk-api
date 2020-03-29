const cdk = require('@aws-cdk/core');

const ElasticBeanStalkStack = require('./elasticbeanstalk');
const S3DeployStack = require('./s3-deploy');
const Route53Stack = require('./route53');

const { AWS_REGION } = require('./constants');

const app = new cdk.App();

const s3Deploy = new S3DeployStack(app, 'S3Stack', {
  stackName: 'S3Stack',
  env: { region: AWS_REGION },
});
const elasticBeanStalkStack = new ElasticBeanStalkStack(app, 'ElasticBeanstalkStack', {
  bucket: s3Deploy.bucket,
  stackName: 'ElasticBeanstalkStack',
  env: { region: AWS_REGION }
});
new Route53Stack(app, 'Route53Stack', {
  stackName: 'Route53Stack',
  elbUrl: elasticBeanStalkStack.stackUrl,
  env: { region: AWS_REGION }
});

app.synth();
