//Create the connection Pool for the DB
var assert = require('assert');
const config = require('@app/config');
const Logger = require('@app/loaders/logger');
var { MongoClient } = require("mongodb");

var mongodb = null;

async function connect(){
    password = config.db_password;
    url_with_password = config.url_db.replace("${p}", password);
    mongodb = await MongoClient.connect(url_with_password, {
            poolSize: 3,
            useUnifiedTopology: true 
        });
    mongodb = mongodb.db("trial_db");
    Logger.info("DB connected");
}
function getDB(){
    assert(mongodb != null);    
    return mongodb;
}


connect();


module.exports = {
    getDB
};
