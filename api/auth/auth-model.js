const db = require("./../../data/dbConfig");

const findById = (id) => {
  return db("users").where({ id }).first();
};

const addUser = async (user) => {
  const [id] = await db("users").insert(user, "id");
  return findById(id);
};

module.exports = {
  addUser,
};
