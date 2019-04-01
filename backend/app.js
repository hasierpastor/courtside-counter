'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const jwt = require('jsonwebtoken');
const { SECRET } = require('../secret');
const { validateSignupSchema, validateLoginSchema } = require('./schema');
const { authenticateUser } = require('./middleware/authenticateUser');
const validateJSONSchema = require('./middleware/validateJSONSchema');
const { UserNotFoundError, PlayerCheckedInError } = require('./errors');
const { getDistanceInMiles } = require('./helpers/getDistanceInMi');
const cron = require('node-cron');
const morgan = require('morgan');
const latLower = 37.883581;
const longLower = -122.269655;
const latUpper = 37.883284;
const longUpper = -122.269609;

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

//Todo: Add logic to post player => if location in radius of court add to one collection, if not add to the other

// set up a connection to the server running on localhost (mongod)
const mongo = new MongoClient('mongodb://localhost:27017', {
  useNewUrlParser: true
});

var db;

/***************** ROUTES ***************************/

/**
 * Route handler for GET to /players => return players at the court (array)
 */

app.get('/players', authenticateUser, async function(req, res, next) {
  try {
    let result = await db
      .collection('players')
      .find()
      .toArray();
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * Route handler for GET to /otw => return players that are on the way to the court (array)
 */
app.get('/otw', authenticateUser, async function(req, res, next) {
  try {
    let result = await db
      .collection('playersotw')
      .find()
      .toArray();
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * Route handler for POST to /players =>  check player into the court, if not checked in then return player and success message.
 * If player already checked in return PlayerCheckedIn error
 */

//add collection for on the way - make a calculation with location parameters
//if certain location addd to on the way - otherwise add to at the court

app.post('/players', authenticateUser, async function(req, res, next) {
  //distance the player is from the court
  let distance = getDistanceInMiles(
    req.body.lat1,
    req.body.long1,
    req.body.lat2,
    req.body.long2
  );
  //boolean which is true if plyer at court/false if player on the way => move logic to helpers
  let isAtCourt =
    req.body.lat1 < latLower &&
    req.body.lat2 > latUpper &&
    req.body.long1 < longLower &&
    req.body.long2 > longUpper;
  let player = req.body;
  let foundPlayer = await db
    .collection('players')
    .findOne({ email: { $eq: player.email } });
  if (foundPlayer === null) {
    let newPlayer = { name: req.body.name, email: req.body.email };
    await db.collection('players').insertOne(newPlayer);
    return res.json({
      message: 'You have successfully checked into the court!',
      newPlayer
    });
  } else {
    let err = new PlayerCheckedInError();
    next(err);
  }
});

/**
 * Route handler for DELETE to /players => removes players from court
 */

app.delete('/players', authenticateUser, async function(req, res, next) {
  try {
    let playerEmail = req.body.email;
    await db.collection('players').deleteOne({ email: { $eq: playerEmail } });
    return res.json({
      status: 'You have succesfully checked out of the court!',
      playerEmail
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Route handler for DELETE to /otw => removes players that are on the way to court
 * /SHOULD THIS BE CALLED WHEN PLAYERS UPDATE LOCATION AND ARE AT THE COURT? => MOVE FROM OTW TO AT THE COURT
 */
app.delete('/otw', authenticateUser, async function(req, res, next) {
  try {
    let playerEmail = req.body.email;
    await db.collection('otw').deleteOne({ email: { $eq: playerEmail } });
    return res.json({
      status: 'You have succesfully updated your location!',
      playerEmail
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Route handler for GET to /players/count => returns number of players at the court
 */

app.get('/players/count', async function(req, res, next) {
  try {
    let playerCount = await db.collection('players').count();
    return res.json({ count: playerCount });
  } catch (err) {
    next(err);
  }
});

/**
 * Route handler for POST to /signup => allows a player to signup to Courtside Counter
 * If player not signed up return JWT and sign up (add to users collection).
 * If player already signed up return JWT
 */

app.post('/signup', validateJSONSchema(validateSignupSchema), async function(
  req,
  res,
  next
) {
  try {
    // console.log(req.body);
    let userEmail = req.body.email;
    let newUser = req.body;
    let userFound = await db
      .collection('users')
      .findOne({ email: { $eq: userEmail } });
    if (userFound === null) {
      let token = jwt.sign(newUser, SECRET);
      await db.collection('users').insertOne(newUser);
      return res.json(token);
    } else {
      let token = jwt.sign(userFound, SECRET);
      return res.json(token);
    }
  } catch (err) {
    next(err);
  }
});

/**
 * Route handler for POST to /login => allows a player to login to Courtside Counter
 * If player not signed up return an error, otherwise login player and return JWT
 */

app.post('/login', validateJSONSchema(validateLoginSchema), async function(
  req,
  res,
  next
) {
  let userEmail = req.body.email;
  let userFound = await db
    .collection('users')
    .findOne({ email: { $eq: userEmail } });
  if (userFound === null) {
    let err = new UserNotFoundError();
    next(err);
  } else {
    let token = jwt.sign(userFound, SECRET);
    res.json(token);
  }
});

/*************** CRON JOB  ******************************/

// Cron Job which clears players from court every 24 hours
cron.schedule('* * */24 * * *', () => {
  db.collection('players').deleteMany({});
  console.log('Players cleared');
});

/************ GENERAL ERROR HANDLER *******************************/

app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  return res.json({
    error: err
  });
});

/************* DATABASE CONNECTION AND SERVER SET UP **********************/

mongo.connect(function(error) {
  // a standard Node.js "error-first" callback
  if (error) {
    // kill express if we cannot connect to the database server
    console.error(error);
    process.exit(1);
  }

  console.log('Successfully connected to database');
  // set the active database
  db = mongo.db('basketball_db');

  app.listen(3333, function() {
    console.log('Courtside Counter API Server listening on port 3333.');
  });
});

module.exports = app;
