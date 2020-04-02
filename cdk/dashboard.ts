import * as cdk from '@aws-cdk/core';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';

export default class CloudWatchDashboardStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dashboard = new cloudwatch.Dashboard(this, 'GigsTechApiDashboard', {
      dashboardName: 'gigs-tech-api-monitoring',
    });

    const response2XXPerHourWidget = new cloudwatch.GraphWidget({
      title: 'Sum of 2XX responses per hour',
      stacked: false,
      left: [
        new cloudwatch.Metric({
          namespace: 'AWS/ApplicationELB',
          metricName: 'HTTPCode_Target_2XX_Count',
          period: cdk.Duration.seconds(3600),
          statistic: 'Sum',
        }),
      ],
    });

    dashboard.addWidgets(response2XXPerHourWidget);
  }
}
