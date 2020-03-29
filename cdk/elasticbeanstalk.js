const path = require('path');
const cdk = require('@aws-cdk/core');
const elasticbeanstalk = require('@aws-cdk/aws-elasticbeanstalk');
const iam = require('@aws-cdk/aws-iam');

const { AWS_REGION } = require('./constants');

class ElasticBeanStalkStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    //objects for access parameters
    const node = this.node;

    const appName = node.tryGetContext('appName');
    const solutionStackName = node.tryGetContext('solutionStackName');

    const ebEc2Role = new iam.Role(this, 'aws-elasticbeanstalk-ec2-role', {
      roleName: 'aws-elasticbeanstalk-ec2-role',
      managedPolicies: [
        { managedPolicyArn: 'arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier' },
        { managedPolicyArn: 'arn:aws:iam::aws:policy/AWSElasticBeanstalkMulticontainerDocker' },
        { managedPolicyArn: 'arn:aws:iam::aws:policy/AWSElasticBeanstalkWorkerTier' },
      ],
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
    });

    const ebEc2InstanceProfile = new iam.CfnInstanceProfile(this, 'aws-elasticbeanstalk-instance-profile', {
      instanceProfileName: 'aws-elasticbeanstalk-instance-profile',
      roles: [ebEc2Role.roleName]
    });

    const ebServiceRole = new iam.Role(this, 'aws-elasticbeanstalk-service-role', {
      roleName: 'aws-elasticbeanstalk-service-role',
      managedPolicies: [
        { managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSElasticBeanstalkEnhancedHealth' },
        { managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSElasticBeanstalkService' },
      ],
      assumedBy: new iam.ServicePrincipal('elasticbeanstalk.amazonaws.com')
    });

    const app = new elasticbeanstalk.CfnApplication(this, 'Application', {
      applicationName: appName
    });

    const applicationVersion = new elasticbeanstalk.CfnApplicationVersion(this, 'ApplicationVersion', {
      applicationName: app.applicationName,
      sourceBundle: {
        s3Bucket: props.bucket.bucketName,
        s3Key: 'dist/dist.zip',
      },
    });

    const configurationTemplate = new elasticbeanstalk.CfnConfigurationTemplate(this, 'ConfigurationTemplate', {
      applicationName: app.applicationName,
      solutionStackName,
      optionSettings: [
        {
          namespace: 'aws:autoscaling:asg',
          optionName: 'MinSize',
          value: '1'
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
        {
          namespace: 'aws:autoscaling:launchconfiguration',
          optionName: 'IamInstanceProfile',
          value: ebEc2InstanceProfile.instanceProfileName,
        }
      ]
    });

    const environment = new elasticbeanstalk.CfnEnvironment(this, 'Environment', {
      environmentName: 'test',
      applicationName: app.applicationName || appName,
      templateName: configurationTemplate.ref,
      versionLabel: applicationVersion.ref,
    });

    this.stackUrl = environment.attrEndpointUrl;

    app.addDependsOn(ebEc2Role);
    app.addDependsOn(ebServiceRole);
    configurationTemplate.addDependsOn(app);
    environment.addDependsOn(app);
    applicationVersion.addDependsOn(app);
  }
}

module.exports = ElasticBeanStalkStack;
