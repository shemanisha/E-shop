const { expressjwt: expressJwt } = require("express-jwt");
const authJwt = () => {
  const secret = process.env.SECRETKEY;
  return expressJwt({
    secret: secret,
    algorithms: ["HS256"],
    // isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/product(.*)/, methods: ["GET", "OPTIONS", "POST"] },
      { url: /\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      "/user/login",
      "/user/register",
    ],
  });
};

// async function isRevoked(req, payload, done) {
//   console.log(payload.isAdmin);
//   if (!payload.isAdmin) {
//     done(null, true);
//   }
//   done();
// }

module.exports = authJwt;
