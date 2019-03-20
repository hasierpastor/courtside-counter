const express = require('express');
const router = new express.Router();
const app = require('../app');
const MongoClient = require('mongodb').MongoClient;

/**
 * Route handler for GET to /players
 */

router.get('/players', function(req, res, next) {
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

//set up a connection to the server running on localhost (mongod)
const mongo = new MongoClient('mongodb://localhost:27017', {
  useNewUrlParser: true
});

let db;

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

module.exports = router;
