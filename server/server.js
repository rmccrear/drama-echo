require("dotenv").config({ path: "./config.env" });

const express = require("express");
const cors = require("cors");

// Auth0
const jwt = require('express-jwt').expressjwt;
const jwks = require('jwks-rsa');

// get MongoDB driver connection
const dbo = require("./src/db/conn");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(require("./src/api-routes/dialogs"));

const jwksUri=process.env.JWKS_URI;
const issuer=process.env.JWT_ISSUER;
const audience=process.env.JWT_AUDIENCE;
console.log(jwksUri, issuer)
console.log(process.env)
var jwtCheck = jwt({
      secret: jwks.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: jwksUri
    }),
    audience: audience,
    issuer: issuer,
    algorithms: ['RS256']
});

app.get("/api/v1/my-profile", jwtCheck, function(req, res){
    return res.json({message: "OK", username: req.auth.nickname});
})

const startServer = async () => {
  try {
    await dbo.connect();
  } catch (err) {
    console.log(err);
    process.exit();
  }
  app.listen(PORT, () => {
    console.log("Running on port: ", PORT);
  });
};
startServer();
