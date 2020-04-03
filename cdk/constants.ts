export default {
  AWS_REGION: 'eu-central-1',
  S3_STACK_NAME: 'ApiS3Stack',
  S3_DEPLOYMENT_KEY: 'dist',
  ELASTICBEANSTALK_STACK_NAME: 'ApiElasticBeanstalkStack',
  ELASTICBEANSTALK_SERVICE_ROLE_NAME: 'api-elasticbeanstalk-service-role',
  ELASTICBEANSTALK_EC2_ROLE_NAME: 'api-elasticbeanstalk-ec2-role',
  ELASTICBEANSTALK_INSTANCE_PROFILE_NAME: 'api-elasticbeanstalk-instance-profile',
  ELASTICBEANSTALK_S3_APPVERSION_KEY: `dist/${process.env.BUNDLE_NAME}.zip`,
  ELASTICBEANSTALK_EC2_KEYPAIR_NAME: 'gigs-tech-eu-central-1',
  ROUTE53_STACK_NAME: 'ApiRoute53Stack',
  DASHBOARD_STACK_NAME: 'ApiCloudWatchDashboardStack',
};
