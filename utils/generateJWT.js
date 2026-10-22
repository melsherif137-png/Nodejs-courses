const jwt = require("jsonwebtoken");

const generateJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "5m",
  });
  return token;
};

module.exports = generateJWT;
