const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const jwt = require('jsonwebtoken');
const { secret } = require('./secret');
const { validateSignupSchema, validateLoginSchema } = require('./schema');
const validateJSONSchema = require('./middleware/validateJSONSchema');
const { UserNotFoundError, PlayerCheckInError } = require('errors');
const cron = require('node-cron');

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
app.get('/players', async function(req, res, next) {
  try {
    let result = await db
      .collection('players') // query players
      .find(); // find all, view result as an array
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * Route handler for POST to /players => returns count of players at the court
 */
//change to token?
app.post('/players', async function(req, res, next) {
  const player = req.body;
  const foundPlayer = await db
    .collection('players')
    .findOne({ email: { $eq: player.email } });
  if (foundPlayer === null) {
    await db.collection('players').insertOne(player);
    return res.json({
      status: 'You have successfully checked into the court!',
      player
    });
  } else {
    let err = new PlayerCheckInError();
    next(err);
  }
});

/**
 * Route handler for POST to /players => removes players
 */
app.delete('/players', async function(req, res, next) {
  const playerEmail = req.body.email;
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
 * Route handler for POST to /signup => allows a player to signup
 */
app.post('/signup', validateJSONSchema(validateSignupSchema), async function(
  req,
  res,
  next
) {
  const userEmail = req.body.email;
  const newUser = req.body;
  const userFound = await db
    .collection('users')
    .findOne({ email: { $eq: userEmail } });
  if (userFound === null) {
    const token = jwt.sign(newUser, secret);
    await db.collection('users').insertOne(newUser);
    return res.json(token);
  } else {
    const token = jwt.sign(userFound, secret);
    return res.json(token);
  }
});

/**
 * Route handler for POST to /login => allows a player to login
 */
app.post('/login', validateJSONSchema(validateLoginSchema), async function(
  req,
  res,
  next
) {
  const userEmail = req.body.email;
  const userFound = await db
    .collection('users')
    .findOne({ email: { $eq: userEmail } });
  if (userFound === null) {
    let err = new UserNotFoundError();
    next(err);
  } else {
    const token = jwt.sign(userFound, secret);
    res.json(token);
  }
});

// Cron Job which clears players from court every 24 hours
cron.schedule('* * */24 * * *', () => {
  db.collection('players').deleteMany({});
  console.log('Players cleared');
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
