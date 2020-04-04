import app from '../../app';
import { agent } from 'supertest';

const koaServer = app.listen();
const request = agent(koaServer);

describe('/api', () => {
  it('should return an entry point response', async () => {
    const response = await request.get('/');

    expect(response.status).toEqual(200);
    expect(response.text).toEqual('API Entry point');
  });

  afterAll(async () => {
    await koaServer.close();
  });
});
