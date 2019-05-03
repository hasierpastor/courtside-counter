const express = require('express');
const router = new express.Router();
const { authenticateUser } = require('../middleware/authenticateUser');
const { getDistanceInMiles } = require('../helpers/getDistanceInMi');
const { PlayerCheckedInError } = require('../errors');
const LAT_LOWER = 37.883581;
const LONG_LOWER = -122.269655;
const LAT_UPPER = 37.883284;
const LONG_UPPER = -122.269609;

const Player = require('../models/Player');
const OTW = require('../models/OTW');

router.get('/', authenticateUser, async function(req, res, next) {
  try {
    let response = await Player.getPlayers();
    return res.json({ players: response });
  } catch (err) {
    next(err);
  }
});

/**
 * Route handler for POST to /players =>  check player into the court, if not checked in then return player and success message.
 * If player already checked in return PlayerCheckedIn error
 */

router.post('/', authenticateUser, async function(req, res, next) {
  try {
    let { lat, long, timestamp } = req.body;
    let { email, name } = req;
    //distance the player is from the court
    let distance = getDistanceInMiles(lat, long, LAT_LOWER, LONG_LOWER);

    //boolean which is true if plyer at court/false if player on the way => move logic to helpers
    let isAtCourt =
      lat < LAT_LOWER &&
      lat > LAT_UPPER &&
      long < LONG_LOWER &&
      long > LONG_UPPER;
    //TODO: SORT PLAYERS BY TIMESTAMP
    if (isAtCourt) {
      //add to player collection and remove from otw collection
      await Promise.all([
        Player.addPlayer(email, name, lat, long, timestamp, distance),
        OTW.removeOTW(email)
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
        OTW.addOTW(email, name, distance, timestamp),
        Player.removePlayer(email)
      ]);

      return res.json({
        message: 'Added to OTW',
        player: { name, email },
        distance,
        timestamp,
        isAtCourt
      });
    } else {
      throw new PlayerCheckedInError();
    }
  } catch (err) {
    next(err);
  }
});

/**
 * Route handler for DELETE to /players => removes players from court
 */

router.delete('/', authenticateUser, async function(req, res, next) {
  try {
    let playerEmail = req.email;
    await Promise.all([Player.removePlayer(playerEmail), OTW.removeOTW(playerEmail)]);
    return res.json({
      message: 'You have successfully checked out!',
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Route handler for GET to /players/count => returns number of players at the court
 */

router.get('/count', authenticateUser, async function(req, res, next) {
  try {
    let playerCount = await Player.countPlayers();
    return res.json({ count: playerCount });
  } catch (err) {
    next(err);
  }
});

/**
 * Route handler for GET to /players/status => returns if user is checkedIn (in otw or players)
 */

router.get('/status', authenticateUser, async function(req, res, next) {
  try {
    let responses = await Promise.all([
      Player.getPlayer(req.email),
      OTW.getOTW(req.email)
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
      distance = otw.distance;
      timestamp = otw.timestamp;
    } else {
      isAtCourt = true;
      isCheckedIn = true;
      distance = player.distance;
      timestamp = player.timestamp;
    }
    return res.json({ isAtCourt, isCheckedIn, distance, timestamp});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
