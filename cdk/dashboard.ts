import AWS from 'aws-sdk';
import * as cdk from '@aws-cdk/core';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';

export default class CloudWatchDashboardStack extends cdk.Stack {
  private dashboard: cloudwatch.Dashboard;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.dashboard = new cloudwatch.Dashboard(this, 'GigsTechApiDashboard', {
      dashboardName: 'gigs-tech-api-monitoring',
    });

    this.addGraphWidgetToDashboard(
      new cloudwatch.GraphWidget({
        title: 'Sum of 2XX responses per hour',
        stacked: false,
        left: [
          new cloudwatch.Metric({
            namespace: 'AWS/ApplicationELB',
            dimensions: {
              'LoadBalancer': 'app/awseb-AWSEB-3H98HD9MFBJU/8c9e6284fdb00c6a'
            },
            metricName: 'HTTPCode_Target_2XX_Count',
            period: cdk.Duration.seconds(3600),
            statistic: cloudwatch.Statistic.SUM,
          })
        ],
      }),
    );
  }

  private async addGraphWidgetToDashboard(widget: cloudwatch.GraphWidget) {
    this.dashboard.addWidgets(widget);
  }
}
