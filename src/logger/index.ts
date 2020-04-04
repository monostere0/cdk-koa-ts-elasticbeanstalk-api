import bunyan from 'bunyan';
import conf from '../conf';
import packageJson from '../../package.json';

const logStreams = [];

if (process.env.NODE_ENV === 'prod') {
  const cloudWatchStream = require('bunyan-cloudwatch')({
    logGroupName: conf().cloudwatch_log_group,
    logStreamName: conf().cloudwatch_log_stream,
    cloudWatchLogsOptions: {
      region: process.env.AWS_REGION,
    },
  });

  logStreams.push({
    type: 'raw',
    stream: cloudWatchStream,
  });
}

export default bunyan.createLogger({
  name: packageJson.name,
});
