const expressJwt = require("express-jwt");

function authJwt() {
  const secret = process.env.SECRETKEY;
  return expressJwt({
    secret: secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/product(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      {
        url: /\/order(.*)/,
        methods: ["GET", "OPTIONS", "POST"],
      },
      "/user/login",
      "/user/register",
      { url: /(.*)/ },
    ],
  });
}

async function isRevoked(req, payload, done) {
  if (payload.isAdmin == true) {
    done();
  } else {
    done(null, true);
  }
}

module.exports = authJwt;
