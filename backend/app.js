'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../secret');
const { validateSignupSchema, validateLoginSchema } = require('./schema');
const { authenticateUser } = require('./middleware/authenticateUser');
const validateJSONSchema = require('./middleware/validateJSONSchema');
const { UserNotFoundError, PlayerCheckedInError } = require('./errors');
const { getDistanceInMiles } = require('./helpers/getDistanceInMi');
const { PORT } = require('./config');
const cron = require('node-cron');
const morgan = require('morgan');
const LAT_LOWER = 37.883581;
const LONG_LOWER = -122.269655;
const LAT_UPPER = 37.883284;
const LONG_UPPER = -122.269609;

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

//Todo: SORT PLAYERS AT COURT/ PLAYERS OTW BY TIMESTAMP
//Todo: BREAK UP POST /PLAYERS => ABSTRACT SOME LOGIC OUT MAYBE
//Todo: MODIFY FRONTEND CHECKIN SO THAT IT WORKS WITH BACKEND POST PLAYERS

/***************** ROUTES ***************************/

/**
 * Route handler for GET to /players => return players at the court (array)
 */

app.get('/players', authenticateUser, async function(req, res, next) {
  try {
    let result = await dbman.db
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
    let result = await dbman.db
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

//BREAK UP TOO MUCH LOGIC?????

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
  let foundPlayer = await dbman.db
    .get()
    .collection('players')
    .findOne({ email: { $eq: player.email } });
  //A BIT CONFUSED ABOUT TIMESTAMP => SORTING BY TIMESTAMP
  if (foundPlayer === null && isAtCourt) {
    let newPlayer = { name: req.body.name, email: req.body.email };
    await dbman.db
      .collection('players')
      .insertOne(newPlayer);
    return res.json({
      message: 'You have successfully checked into the court!',
      newPlayer
    });
  }
  if (foundPlayer === null && !isAtCourt) {
    //players on the way also have a distance property (calculated above)
    let newPlayer = { name: req.body.name, email: req.body.email, distance };
    await dbman.db
      .collection('playersotw')
      .insertOne(newPlayer);
    return res.json({
      //we can display the users that are at the court in this message to motivate people?
      message: 'You are on the way! Get there quickly to play some ball',
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
    await dbman.db
      .collection('players')
      .deleteOne({ email: { $eq: playerEmail } });
    return res.json({
      status: 'You have successfully checked out of the court!',
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
    await dbman.db
      .collection('otw')
      .deleteOne({ email: { $eq: playerEmail } });
    return res.json({
      status: 'You have successfully updated your location!',
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
    console.log(db.get());
    let playerCount = await dbman.db
      .collection('players')
      .count();
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
    let userEmail = req.body.email;
    let newUser = req.body;
    let userFound = await db
      .get()
      .collection('users')
      .findOne({ email: { $eq: userEmail } });
    if (userFound === null) {
      let token = jwt.sign(newUser, SECRET);
      await db
        .get()
        .collection('users')
        .insertOne(newUser);
      return res.json({ _token: token });
    } else {
      let token = jwt.sign(userFound, SECRET);
      return res.json({ _token: token });
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
  console.dir('db', db.get());
  let dbget = db.get();
  let users = db.get().collection('users');
  let userEmail = req.body.email;
  let userFound = await users.findOne({ email: { $eq: userEmail } });
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
  db.get()
    .collection('players')
    .deleteMany({});
  console.log('Clearing players');
});

/************ GENERAL ERROR HANDLER *******************************/

app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  return res.json({
    error: err
  });
});

/************* DATABASE CONNECTION AND SERVER SET UP **********************/
dbman.start(function(error) {
  // a standard Node.js "error-first" callback
  if (error) {
    // kill express if we cannot connect to the database server
    console.error(error);
    process.exit(1);
  }

  console.log('Successfully connected to database');

  app.listen(PORT, function() {
    console.log(`Courtside Counter API Server listening on port ${PORT}.`);
  });
});

module.exports = app;
