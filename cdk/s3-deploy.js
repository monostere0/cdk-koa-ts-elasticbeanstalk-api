const path = require('path');
const cdk = require('@aws-cdk/core');
const { Bucket, BlockPublicAccess } = require('@aws-cdk/aws-s3');
const s3Deployment = require('@aws-cdk/aws-s3-deployment');

class S3DeployStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const s3Bucket = new Bucket(this, 'SourceBucket', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      bucketName: `elasticbeanstalk-${cdk.Stack.of(this).region}-${cdk.Stack.of(this).account}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.bucket = s3Bucket;

    const bucketDeployment = new s3Deployment.BucketDeployment(this, 'gigs-tech-api', {
      sources: [s3Deployment.Source.asset(path.join(__dirname, '..', 'dist'))],
      destinationKeyPrefix: 'dist',
      destinationBucket: s3Bucket,
      retainOnDelete: false,
    });
  }
}

module.exports = S3DeployStack;
