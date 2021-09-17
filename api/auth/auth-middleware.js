const db = require("./../../data/dbConfig");

const validateCredentials = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      status: 401,
      message: "username and password required",
    });
  } else {
    next();
  }
};

const checkUsernameExists = async (req, res, next) => {
  const existingUser = await db("users")
    .where("username", req.body.username)
    .first();
  if (!existingUser) {
    next({
      status: 401,
      message: "username taken",
    });
  } else {
    next();
  }
};

module.exports = {
  validateCredentials,
  checkUsernameExists,
};
