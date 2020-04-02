import path from 'path';
import * as cdk from '@aws-cdk/core';
import { Bucket, BlockPublicAccess } from '@aws-cdk/aws-s3';
import * as s3Deployment from '@aws-cdk/aws-s3-deployment';
import constants from './constants';

export default class S3DeployStack extends cdk.Stack {
  bucket: Bucket;

  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const node = this.node;

    const appName: string = node.tryGetContext('appName');

    this.bucket = new Bucket(this, 'SourceBucket', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      bucketName: `elasticbeanstalk-${cdk.Stack.of(this).region}-${cdk.Stack.of(this).account}-${appName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new s3Deployment.BucketDeployment(this, 'SourceBucketDeployment', {
      sources: [s3Deployment.Source.asset(path.join(__dirname, '..', 'dist'))],
      destinationKeyPrefix: constants.S3_DEPLOYMENT_KEY,
      destinationBucket: this.bucket,
      retainOnDelete: false,
    });
  }
}
