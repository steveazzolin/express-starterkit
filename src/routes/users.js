const { Router } = require('express');
const Logger = require('../loaders/logger');
const asyncHandler = require('express-async-handler');
const UserService = require('@app/services/users');

const route = Router();

module.exports = async function(routes) {
  routes.use('/users', route);

  route.get('/', asyncHandler(async (req, res, next) => {
    const filters = req.query;
    const users = await UserService.find(filters);

    res.status(200);
    res.response = users; // attacco a response l'oggetto che deve inviare. Il post-filter farà l'invio (in express.js)
    next();
  }));

};
