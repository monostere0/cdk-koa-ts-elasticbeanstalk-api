const app = require('../../../app');
const request = require('supertest').agent(app.listen());
const { expect } = require('chai');

describe('/api', () => {
  it('should return an entry point response', async () => {
    const response = await request.get('/');

    expect(response.status).to.equal(200);
    expect(response.text).to.equal('API Entry point');
  });
});
