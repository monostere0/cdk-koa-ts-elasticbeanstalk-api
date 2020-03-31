const path = require('path');
const cdk = require('@aws-cdk/core');
const { Bucket, BlockPublicAccess } = require('@aws-cdk/aws-s3');
const s3Deployment = require('@aws-cdk/aws-s3-deployment');
const constants = require('./constants');

class S3DeployStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const node = this.node;

    const appName = node.tryGetContext('appName');

    const s3Bucket = new Bucket(this, 'SourceBucket', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      bucketName: `elasticbeanstalk-${cdk.Stack.of(this).region}-${cdk.Stack.of(this).account}-${appName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.bucket = s3Bucket;

    const bucketDeployment = new s3Deployment.BucketDeployment(this, 'SourceBucketDeployment', {
      sources: [s3Deployment.Source.asset(path.join(__dirname, '..', 'dist'))],
      destinationKeyPrefix: constants.S3_DEPLOYMENT_KEY,
      destinationBucket: s3Bucket,
      retainOnDelete: false,
    });
  }
}

module.exports = S3DeployStack;
