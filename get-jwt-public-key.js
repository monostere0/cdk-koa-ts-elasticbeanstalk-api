const fs = require('fs');

module.exports = function getJwtSecret() {
  return fs.readFileSync('./jwt/jwtRS256.key.pub');
}
