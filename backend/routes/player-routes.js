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


module.exports = router;
