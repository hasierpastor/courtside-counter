const express = require('express');
const router = new express.Router();
const { validateSignupSchema, validateLoginSchema, validateCheckinSchema } = require('../schema');
const validateJSONSchema = require('../middleware/validateJSONSchema');
const { authenticateUser } = require('../middleware/authenticateUser');
const { getDistanceInMiles } = require('../helpers/getDistanceInMi');
const { PlayerCheckedInError } = require('../errors');
const Player = require('../models/Player');
const OTW = require('../models/OTW');
const User = require('../models/User');

const LAT = 37.883452;
const LONG = -122.269352;
const PERIMETER_IN_FEET = 200;
const PERIMETER_IN_MILES = 0.03787878787878788;


router.post('/signup', validateJSONSchema(validateSignupSchema), async function(
  req,
  res,
  next
) {
  try {
    let user = req.body;
    let response = await User.signup(user);
    return res.json({ _token: response });
  } catch (err) {
    next(err);
  }
});

/**
 * Route handler for POST to /login => allows a player to login to Courtside Counter
 * If player not signed up return an error, otherwise login player and return JWT
 */

router.post('/login', validateJSONSchema(validateLoginSchema), async function(
  req,
  res,
  next
) {
  try {
    let userEmail = req.body.email;
    let response = await User.login(userEmail);
    res.json({ _token: response });
  } catch (err) {
    next(err);
  }
});

/**
 * Route handler for POST to /checkin =>  check player into the court, if not checked in then return player and success message.
 * If player already checked in return PlayerCheckedIn error
 */

//add validation

router.post(
  '/checkin',
  validateJSONSchema(validateCheckinSchema),
  authenticateUser,
  async function(req, res, next) {
    try {
      let { lat, long, timestamp } = req.body;
      let { email, name, _id } = req;

      //distance the player is from the court
      let distance = getDistanceInMiles(lat, long, LAT, LONG);

      //boolean which is true if plyer at court/false if player on the way => move logic to helpers
      let isAtCourt = distance < (PERIMETER_IN_FEET / 5280);

      //TODO: SORT PLAYERS BY TIMESTAMP
      if (isAtCourt) {
        //add to player collection and remove from otw collection
        await Promise.all([
          Player.addPlayer(email, name, lat, long, timestamp, distance, _id),
          OTW.removeOTW(_id)
        ]);

        return res.json({
          message: 'Checked into court',
          player: { name, email },
          distance,
          timestamp,
          isAtCourt
        });
      }

      if (!isAtCourt) {
        //add to otw collection and remove from player collection
        await Promise.all([
          OTW.addOTW(email, name, lat, long, timestamp, distance, _id),
          Player.removePlayer(_id)
        ]);

        return res.json({
          message: 'Added to OTW',
          player: { name, email },
          distance,
          lat,
          long,
          timestamp,
          isAtCourt
        });
      } else {
        throw new PlayerCheckedInError();
      }
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Route handler for DELETE to /checkout => removes players from court
 */

router.delete('/checkout', authenticateUser, async function(req, res, next) {
  try {
    let _id = req._id;
    await Promise.all([
      Player.removePlayer(_id),
      OTW.removeOTW(_id)
    ]);
    return res.json({
      message: 'You have successfully checked out!'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Route handler for GET to /status/:id => returns if user is checkedIn (in otw or players)
 */

router.get('/status/:id', authenticateUser, async function(req, res, next) {
  try {
    let responses = await Promise.all([
      Player.getPlayer(req.params._id),
      OTW.getOTW(req.params._id)
    ]);
    let [player, otw] = responses;
    let isCheckedIn, distance, timestamp, isAtCourt;
    if (!player && !otw) {
      isCheckedIn = false;
      distance = null;
      timestamp = null;
      isAtCourt = false;
    } else if (otw) {
      isCheckedIn = true;
      isAtCourt = false;
      distance = otw.distance;
      timestamp = otw.timestamp;
    } else {
      isAtCourt = true;
      isCheckedIn = true;
      distance = player.distance;
      timestamp = player.timestamp;
    }
    return res.json({ isAtCourt, isCheckedIn, distance, timestamp });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

