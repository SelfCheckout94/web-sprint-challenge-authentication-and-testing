const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secret");

const buildToken = (user) => {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

module.exports = { buildToken };
