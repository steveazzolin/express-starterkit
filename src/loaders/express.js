const bodyParser = require('body-parser');
const cors = require('cors');
const Logger = require('../loaders/logger');

const routes = require('@app/routes');
const config = require('@app/config');

// adapted from: https://github.com/santiq/bulletproof-nodejs/blob/master/src/loaders/express.ts

async function loader(app) {
  /**
   * Health Check endpoints
   */
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json());

  //Intercetta tutte le richieste per le API per controlli/funzioni comuni a tutte le API
  function preFilter(req, res, next) {
    Logger.info("preFilter");
    res.statusCode = -1; //Se il postFilter riceve lo status a -1 allora la richiesta non è stata servita da nessuna API (404)
    req.start_time = new Date();
    next();
  }

  app.use(config.api.prefix, preFilter, routes());  //ascolta in /api/ ed invoca routes()

  /// error handler
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.response = { errors: { message: err.message } };
    Logger.info("Error:" + err.message);  //Stampo sempre qua gli errori così da non dover stampare a console ogni volta che c'è il throw di un errore
    next();//vado a postFilter
  });


  function postFilter(req, res, next) {
    Logger.info(`Request ended in ${new Date() - req.start_time}ms`);

    if (res.statusCode < 0) { //nessun errore si è verificato ma nessun servizio è stato invocato (404)
      res.status(404);
      res.response = { errors: { message: "Not Found" } };
    }
    res.json(res.response).end(); //In questa API faccio sempre .json() per inviare i dati. Se non fosse così potrei inserire in res metadati per differenziare .send()/.json()
  }


  app.use(postFilter);
}

module.exports = loader;