const cdk = require('@aws-cdk/core');
const route53 = require('@aws-cdk/aws-route53');

class Route53Stack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const domainName = this.node.tryGetContext('domainName');

    const hostedZone = new route53.PublicHostedZone(this, 'TechGigsHostedZone', {
      zoneName: domainName,
    });

    const gigsTechRecord = new route53.CnameRecord(this, 'AliasRecordForElb', {
      domainName: props.elbUrl,
      zone: hostedZone,
      recordName: 'api',
      ttl: cdk.Duration.seconds(60),
    });
  }
}

module.exports = Route53Stack;
