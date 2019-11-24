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

  //Intercetta tutte le richieste per le API per controlli/funzioni comuni a tutte le API (traduzione ids,controllo headers/IP,settaggio tempo inizio richiesta,contabilizzazione uso API...)
  function preFilter(req, res,next) {
    Logger.info("preFilter");
    req.start_time = new Date();
    next();
  }
  function postFilter(req,res){
    Logger.info(`Request ended in ${new Date() - req.start_time}ms`);
    res.json(res.response); //In questa API faccio sempre .json() per inviare i dati. Se non fosse così potrei inserire in res metadati per differenziare .send()/.json()
    //il .json/send/end non terminano l'esecuzione
  }


  // Load API routes
  app.use(config.api.prefix, preFilter, routes(), postFilter);  //ascolta in /api/ ed invoca routes()

  //Se l'URL non è stato matchato tra quelli definiti in routes allora genera errore
  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
  });

  /// error handlers
  app.use((err, req, res, next) => {
    /**
     * Handle 401 thrown by express-jwt library or 401 in general.
     */
    if (err.name === 'UnauthorizedError' || err.status === 401) {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end(); 
    }
    return next(err);
  });
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message
      }
    });
  });
}

module.exports = loader;
