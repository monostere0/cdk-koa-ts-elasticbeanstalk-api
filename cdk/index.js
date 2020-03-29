const cdk = require('@aws-cdk/core');

const ElasticBeanStalkStack = require('./elasticbeanstalk');
const S3DeployStack = require('./s3-deploy');

const { AWS_REGION } = require('./constants');

const app = new cdk.App();

const s3Deploy = new S3DeployStack(app, 'S3Stack', {
  stackName: 'S3Stack',
  env: { region: AWS_REGION },
});
new ElasticBeanStalkStack(app, 'ElasticBeanstalkStack', {
  bucket: s3Deploy.bucket,
  stackName: 'ElasticBeanstalkStack',
  env: { region: AWS_REGION }
});

app.synth();
