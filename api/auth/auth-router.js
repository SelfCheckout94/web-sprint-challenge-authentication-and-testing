const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { buildToken } = require("./token-builder");
const Users = require("./auth-model");

const {
  validateCredentials,
  checkUsernameExists,
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

router.post("/login", validateCredentials, (req, res, next) => {
  const { username, password } = req.body;

  Users.findBy({ username }).then(([user]) => {
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = buildToken(user);
      res.status(200).json({
        message: `welcome, ${username}`,
        token,
      });
    } else {
      next({
        status: 401,
        message: "invalid credentials",
      });
    }
  });
});

module.exports = router;
