const bunyan = require('bunyan');
const conf = require('../conf')();
const packageJson = require('../../package.json');

const logStreams = [];

if (process.env.NODE_ENV === 'prod') {
  const cloudWatchStream = require('bunyan-cloudwatch')({
    logGroupName: conf.cloudwatch_log_group,
    logStreamName: conf.cloudwatch_log_stream,
    cloudWatchLogsOptions: {
      region: process.env.AWS_REGION,
    },
  });

  logStreams.push({
    type: 'raw',
    stream: cloudWatchStream,
  });
}

module.exports = bunyan.createLogger({
  name: packageJson.name,
});
