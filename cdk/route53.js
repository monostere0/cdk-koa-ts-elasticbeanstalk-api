const cdk = require('@aws-cdk/core');
const route53 = require('@aws-cdk/aws-route53');

const ELB_HOSTED_ZONE_ID = 'Z215JYRZR1TBD5';

class Route53Stack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const domainName = this.node.tryGetContext('domainName');

    const hostedZone = new route53.PublicHostedZone(this, 'TechGigsHostedZone', {
      zoneName: domainName,
    });

    const gigsTechRecord = new route53.ARecord(this, 'TechGigsAliasRecord', {
      recordName: 'api',
      zone: hostedZone,
      ttl: cdk.Duration.seconds(60),
      target: route53.RecordTarget.fromAlias({
        bind() {
          return {
            dnsName: props.elbUrl,
            hostedZoneId: ELB_HOSTED_ZONE_ID,
          };
        },
      }),
    });
  }
}

module.exports = Route53Stack;
