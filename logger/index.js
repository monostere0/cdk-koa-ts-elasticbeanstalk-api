const bunyan = require('bunyan');
const conf = require('../conf')();
const createCloudWatchStream = require('bunyan-cloudwatch');

const packageJson = require('../package.json');

const cloudWatchStream = createCloudWatchStream({
  logGroupName: conf.cloudwatch_log_group,
  logStreamName: conf.cloudwatch_log_stream,
  cloudWatchLogsOptions: {
    region: process.env.AWS_REGION,
  },
});

module.exports = bunyan.createLogger({
  name: packageJson.name,
  streams: [
    {
      type: 'raw',
      stream: cloudWatchStream,
    },
  ],
});
