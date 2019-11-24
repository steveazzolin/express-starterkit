const { Router } = require('express');

const users = require('./users');

module.exports = () =>{
  const routes = Router();
  users(routes);
  //aggiungere qui altri servizi
  return routes;
};
