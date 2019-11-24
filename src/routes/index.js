const { Router } = require('express');

const users = require('./users');

module.exports = () =>{
  try{
    const routes = Router();
    users(routes);
    //aggiungere qui altri servizi
    return routes;
  }catch(error){
    const err = new Error('InternalError');
    err['status'] = 599;
    next(err);
  }
  
};
