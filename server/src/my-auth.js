// Auth0
const jwt = require("express-jwt").expressjwt;
const jwks = require("jwks-rsa");

const jwksUri = process.env.JWKS_URI;
const issuer = process.env.JWT_ISSUER;
const audience = process.env.JWT_AUDIENCE;
console.log(jwksUri, issuer);
console.log(process.env);
var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: jwksUri,
  }),
  audience: audience,
  issuer: issuer,
  algorithms: ["RS256"],
});

module.exports = { jwtCheck };
