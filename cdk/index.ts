import * as cdk from '@aws-cdk/core';

import ElasticBeanStalkStack from './elasticbeanstalk';
import S3DeployStack from './s3-deploy';
import Route53Stack from './route53';
import CloudWatchDashboardStack from './dashboard';
import constants from './constants';

function main() {
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
    stackName: constants.DASHBOARD_STACK_NAME,
    env: { region: constants.AWS_REGION },
  });

  app.synth();
}

main();
