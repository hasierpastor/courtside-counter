const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

app.use(express.json());

app.use(cors());

// set up a connection to the server running on localhost (mongod)
const mongo = new MongoClient('mongodb://localhost:27017', {
  useNewUrlParser: true
});

let db;

/**
 * Route handler for GET to /pets
 */
app.get('/players', function(req, res, next) {
  db.collection('players') // query players
    .find() // find all, view result as an array
    .toArray(function(error, result) {
      // a standard Node.js "error-first" callback
      if (error) {
        return res.json({ error });
      }
      // return the JSON of the result array
      return res.json(result);
    });
});

/** 404 handler */

app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;

  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */

app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});

/**
 * Database connection and server set-up
 */
mongo.connect(function(error) {
  // a standard Node.js "error-first" callback
  if (error) {
    // kill express if we cannot connect to the database server
    console.error(error);
    process.exit(1);
  }

  // if we reach this line, we've made it
  console.log('Successfully connected to database');
  // set the active database
  db = mongo.db('basketball_db');

  // standard express app.listen
  app.listen(3333, function() {
    console.log('Courtside Counter API Server listening on port 3333.');
  });
});

module.exports = app;
