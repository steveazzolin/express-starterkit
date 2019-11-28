const Logger = require('../loaders/logger');
var db_connection = require("./connection");

async function create(user) {
  //users.push(user);
}


async function find(filters) {
  const db = db_connection.getDB();
  ret = await db.collection("users").find().toArray();
  console.log(JSON.stringify(ret));
  return ret;
}

module.exports = {
  create,
  find
};
