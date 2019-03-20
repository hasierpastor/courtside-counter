const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const jwt = require('jsonwebtoken');
const secret = require('./secret');

app.use(express.json());

app.use(cors());

// set up a connection to the server running on localhost (mongod)
const mongo = new MongoClient('mongodb://localhost:27017', {
  useNewUrlParser: true
});

let db;

/**
 * Route handler for GET to /players => return players at court
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

/**
 * Route handler for POST to /players => returns count of players at the court
 */
app.post('/players', async function(req, res, next) {
  const player = req.body;
  console.log(player);
  await db.collection('players').insertOne(player);
  return res.json({ status: 'success', player });
});

/**
 * Route handler for POST to /players => removes players
 */
app.delete('/players', async function(req, res, next) {
  const playerEmail = req.body.email;
  console.log(playerEmail);
  await db.collection('players').deleteOne({ email: { $eq: playerEmail } });
  return res.json({ status: 'removed', playerEmail });
});

/**
 * Route handler for GET to /players/count => returns count of players at the court
 */
app.get('/players/count', async function(req, res, next) {
  let playerCount = await db
    .collection('players') // query players
    .count(); //find count
  return res.json({ count: playerCount });
});

/**
 * Route handler for POST to /signup => returns count of players at the court
 */
app.get('/players/count', async function(req, res, next) {
  let playerCount = await db
    .collection('players') // query players
    .count(); //find count
  return res.json({ count: playerCount });
});

/**
 * Route handler for POST to /signup => allows a player to signup
 */
app.get('/signup', async function(req, res, next) {
  let user = req.body;
  const token = jwt.sign(user, secret);
  return res.json(token);
});

/**
 * Route handler for POST to /login => allows a player to login
 */
app.get('/login', async function(req, res, next) {});

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
