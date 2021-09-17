const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { buildToken } = require("./token-builder");
const Users = require("./auth-model");

const {
  validateCredentials,
  checkUsernameExists,
  loginCheckUsername,
} = require("./auth-middleware");

router.post(
  "/register",
  validateCredentials,
  checkUsernameExists,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const hash = bcrypt.hashSync(password, 8);
      const newUser = { username, password: hash };

      const user = await Users.addUser(newUser);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/login",
  loginCheckUsername,
  validateCredentials,
  (req, res, next) => {
    const { username, password } = req.body;

    Users.findBy({ username }).then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = buildToken(user);
        res.status(200).json({
          message: `Welcome, ${username}`,
          token,
        });
      } else {
        next();
      }
    });
    /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
  }
);

module.exports = router;
