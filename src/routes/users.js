const { Router } = require('express');
const Logger = require('../loaders/logger');

const UserService = require('@app/services/users');

const route = Router();

module.exports = async function(routes) {
  routes.use('/users', route);

  route.get('/', async (req, res,next) => {
    const filters = req.query;
    //const users = await UserService.find(filters).catch((err) => { next(err); } );
    users={name:"Steve",age:21};

    //throw  Error("UnauthorizedError");
    Logger.info("i am routes/users.js");
    //res.status(200).json(users);    Originariamente invio direttamente il risultato da qua
    res.status(200);
    res.response = users; //mentre qua attacco a res l'oggetto che deve inviare. Il post-filter farà l'invio
    next();
  }); 


  route.get('/:id', async (req, res, next) => {
    const filters = req.query;
    //const users = await UserService.find(filters).catch((err) => { next(err); } );
    users = { name: "Rob", age: 99 };

    //throw  Error("UnauthorizedError");
    Logger.info("looking for id = " + req.params.id);
    //res.status(200).json(users);    Originariamente invio direttamente il risultato da qua
    res.status(200);
    res.response = users; //mentre qua attacco a res l'oggetto che deve inviare. Il post-filter farà l'invio
    next();
  }); 

  route.get('/:id/movies', async (req, res, next) => {
    const filters = req.query;
    //const users = await UserService.find(filters).catch((err) => { next(err); } );
    users = { film: "4 + 4", runtime: 99 };

    //throw  Error("UnauthorizedError");
    Logger.info("looking for movies of user_id = " + req.params.id);
    //res.status(200).json(users);    Originariamente invio direttamente il risultato da qua
    res.status(200);
    res.response = users; //mentre qua attacco a res l'oggetto che deve inviare. Il post-filter farà l'invio
    next();
  }); 
};
