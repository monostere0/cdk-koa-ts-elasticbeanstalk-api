import * as cdk from '@aws-cdk/core';
import * as elasticbeanstalk from '@aws-cdk/aws-elasticbeanstalk';
import * as iam from '@aws-cdk/aws-iam';
import { Bucket } from '@aws-cdk/aws-s3';

import constants from './constants';

export default class ElasticBeanStalkStack extends cdk.Stack {
  stackUrl: string;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps & { bucket: Bucket }) {
    super(scope, id, props);

    const node = this.node;

    const appName = node.tryGetContext('appName');
    const solutionStackName = node.tryGetContext('solutionStackName');
    const sslCertificateArn = node.tryGetContext('sslCertificateArn');

    const ebEc2Role = new iam.Role(this,
      constants.ELASTICBEANSTALK_EC2_ROLE_NAME, {
      roleName: constants.ELASTICBEANSTALK_EC2_ROLE_NAME,
      managedPolicies: [
        { managedPolicyArn: 'arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier' },
        { managedPolicyArn: 'arn:aws:iam::aws:policy/AWSElasticBeanstalkMulticontainerDocker' },
        { managedPolicyArn: 'arn:aws:iam::aws:policy/AWSElasticBeanstalkWorkerTier' },
      ],
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    const ebEc2InstanceProfile = new iam.CfnInstanceProfile(this,
      constants.ELASTICBEANSTALK_INSTANCE_PROFILE_NAME, {
      instanceProfileName: constants.ELASTICBEANSTALK_INSTANCE_PROFILE_NAME,
      roles: [ebEc2Role.roleName],
    });

    new iam.Role(this,
      constants.ELASTICBEANSTALK_SERVICE_ROLE_NAME, {
      roleName: constants.ELASTICBEANSTALK_SERVICE_ROLE_NAME,
      managedPolicies: [
        { managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSElasticBeanstalkEnhancedHealth' },
        { managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSElasticBeanstalkService' },
      ],
      assumedBy: new iam.ServicePrincipal('elasticbeanstalk.amazonaws.com'),
    });

    const app = new elasticbeanstalk.CfnApplication(this, 'Application', {
      applicationName: appName,
    });

    const applicationVersion = new elasticbeanstalk.CfnApplicationVersion(this,
      'ApplicationVersion', {
      applicationName: app.applicationName,
      sourceBundle: {
        s3Bucket: props.bucket.bucketName,
        s3Key: constants.ELASTICBEANSTALK_S3_APPVERSION_KEY,
      },
    });

    const configurationTemplate = new elasticbeanstalk.CfnConfigurationTemplate(this,
      'ConfigurationTemplate', {
      applicationName: app.applicationName,
      solutionStackName,
      optionSettings: [
        // Set up the autoscaling group rules
        {
          namespace: 'aws:autoscaling:asg',
          optionName: 'MinSize',
          value: '1',
        },
        {
          namespace: 'aws:autoscaling:asg',
          optionName: 'MaxSize',
          value: '2',
        },
        {
          namespace: 'aws:elasticbeanstalk:environment',
          optionName: 'EnvironmentType',
          value: 'LoadBalanced',
        },
        // Configure an ALB instead of Classic Load balancer
        {
          namespace: 'aws:elasticbeanstalk:environment',
          optionName: 'LoadBalancerType',
          value: 'application',
        },
        // Configure the instance profile for underlying EC2s
        {
          namespace: 'aws:autoscaling:launchconfiguration',
          optionName: 'IamInstanceProfile',
          value: ebEc2InstanceProfile.instanceProfileName,
        },
        // Add SSH key/value pair
        {
          namespace: 'aws:autoscaling:launchconfiguration',
          optionName: 'EC2KeyName',
          value: constants.ELASTICBEANSTALK_EC2_KEYPAIR_NAME,
        },
        // ElasticBeanStalk environment variables
        {
          namespace: 'aws:elasticbeanstalk:application:environment',
          optionName: 'AWS_REGION',
          value: constants.AWS_REGION,
        },
        // Configure the HTTPS certificate in the Application Load Balancer
        {
          namespace: 'aws:elbv2:listener:443',
          optionName: 'ListenerEnabled',
          value: 'true',
        },
        {
          namespace: 'aws:elbv2:listener:443',
          optionName: 'Protocol',
          value: 'HTTPS',
        },
        {
          namespace: 'aws:elbv2:listener:443',
          optionName: 'SSLCertificateArns',
          value: sslCertificateArn,
        },
      ],
    });

    const environment = new elasticbeanstalk.CfnEnvironment(this, 'Environment', {
      applicationName: app.applicationName || appName,
      templateName: configurationTemplate.ref,
      versionLabel: applicationVersion.ref,
    });

    this.stackUrl = environment.attrEndpointUrl;

    configurationTemplate.addDependsOn(app);
    environment.addDependsOn(app);
    applicationVersion.addDependsOn(app);
  }
}
