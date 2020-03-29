const conf = require('./conf')();
const app = require('./app');

app.listen(conf.port, () => {
  console.log('tech-gigs-api started at port', conf.port);
});
