const { expressjwt: expressJwt } = require("express-jwt");
const authJwt = () => {
  const secret = process.env.SECRETKEY;
  return expressJwt({ secret: secret, algorithms: ["RS256"] });
};

module.exports = authJwt;
