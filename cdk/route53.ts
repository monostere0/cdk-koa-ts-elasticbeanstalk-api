import * as cdk from '@aws-cdk/core';
import * as route53 from '@aws-cdk/aws-route53';

const DOMAIN_HOSTED_ZONE_ID = 'Z0316532EMT40311TJI4';
const ELB_HOSTED_ZONE_ID = 'Z215JYRZR1TBD5';

export default class Route53Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps & { elbUrl: string }) {
    super(scope, id, props);

    const domainName = this.node.tryGetContext('domainName');
    const subDomainName = this.node.tryGetContext('subDomainName');

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'TechGigsHostedZone', {
      hostedZoneId: DOMAIN_HOSTED_ZONE_ID,
      zoneName: domainName,
    });

    new route53.ARecord(this, 'TechGigsAliasRecord', {
      recordName: subDomainName,
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
