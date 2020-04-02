const cdk = require('@aws-cdk/core');
const cloudwatch = require('@aws-cdk/aws-cloudwatch');

class CloudWatchDashboardStack extends cdk.Stack {
  constructor(scope, id, props, ) {
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

module.exports = CloudWatchDashboardStack;
