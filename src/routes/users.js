const { Router } = require('express');
const Logger = require('../loaders/logger');

const UserService = require('@app/services/users');

const route = Router();

module.exports = async function(routes) {
  routes.use('/users', route);

  route.get('/', async (req, res) => {
    const filters = req.query;
    const users = await UserService.find(filters);
    //throw new Error("UnauthorizedError");
    Logger.info("routes/users.js");
    res.status(200).json(users);    
    //il .json/send/end non terminano l'esecuzione
  });

  
};
