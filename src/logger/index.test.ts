import bunyan from 'bunyan';
import conf from '../conf';

const mockCreateCloudWatchStream = jest.fn();

jest.mock('bunyan', () => ({
  createLogger: jest.fn(),
}));
jest.mock('../conf', () => jest.fn(() => ({})));
jest.mock('../../package.json', () => ({ name: 'foo' }));
jest.mock('bunyan-cloudwatch', () => mockCreateCloudWatchStream);

describe('logger', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not add cloud watch streams for non prod environments', () => {
    jest.isolateModules(() => {
      require('./index');
    });
    expect(bunyan.createLogger).toHaveBeenCalledWith({ name: 'foo' });
    expect(mockCreateCloudWatchStream).not.toHaveBeenCalled();
  });

  it('should add the cloud watch stream for prod environments', () => {
    process.env.NODE_ENV = 'prod';
    require('./index');
    expect(bunyan.createLogger).toHaveBeenCalledWith({ name: 'foo', streams: [{ type: 'raw', stream: undefined }] });
    expect(mockCreateCloudWatchStream).toHaveBeenCalled();
    expect(conf).toHaveBeenCalledTimes(2);
  });
});
