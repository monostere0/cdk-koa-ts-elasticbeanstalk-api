import errorMiddleware from './error';
import logger from '../../logger';

jest.mock('../../logger', () => ({
  error: jest.fn(),
}));

describe('api/middleware/errorMiddleware', () => {
  it('should pass the request if there is no error', async () => {
    await errorMiddleware(({} as any), () => Promise.resolve());
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should report the error and log it', async () => {
    const ctx: any = {
      app: {
        emit: jest.fn(),
      },
    };
    const error = { status: 400, message: 'Foo' };
    await errorMiddleware(ctx, () => Promise.reject(error));

    expect(logger.error).toHaveBeenCalledWith(error);
    expect(ctx.status).toBe(400);
    expect(ctx.body).toBe(error.message);
    expect(ctx.app.emit).toHaveBeenCalledWith('error', error, ctx);
  });
});
