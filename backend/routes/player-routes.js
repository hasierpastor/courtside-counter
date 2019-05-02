const express = require('express');
const router = new express.Router();
const { authenticateUser } = require('../middleware/authenticateUser');
const { getDistanceInMiles } = require('../helpers/getDistanceInMi');
const mongoUtil = require('../mongoUtil');
const db = mongoUtil.get();
const { PlayerCheckedInError } = require('../errors');
const LAT_LOWER = 37.883581;
const LONG_LOWER = -122.269655;
const LAT_UPPER = 37.883284;
const LONG_UPPER = -122.269609;

const Player = require('../models/Player');

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

//BREAK UP TOO MUCH LOGIC?????

router.post('/', authenticateUser, async function(req, res, next) {
  try {
    //distance the player is from the court
    let distance = getDistanceInMiles(
      req.body.lat1,
      req.body.long1,
      req.body.lat2,
      req.body.long2
    );
    //boolean which is true if plyer at court/false if player on the way => move logic to helpers
    let isAtCourt =
      req.body.lat1 < LAT_LOWER &&
      req.body.lat2 > LAT_UPPER &&
      req.body.long1 < LONG_LOWER &&
      req.body.long2 > LONG_UPPER;
    let player = req.body;

    let response = await Player.checkinPlayer(player, isAtCourt, distance);
    return res.json({ message: response.message, player: response.player });
  } catch (err) {
    next(err);
  }
});

/**
 * Route handler for DELETE to /players => removes players from court
 */

router.delete('/', authenticateUser, async function(req, res, next) {
  try {
    let player = req.body;
    let playerEmail = req.body.email;
    await Player.removePlayer(playerEmail);
    return res.json({
      message: 'You have successfully checked out of the court!',
      player
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Route handler for GET to /players/count => returns number of players at the court
 */

router.get('/count', async function(req, res, next) {
  try {
    let playerCount = await Player.countPlayers();
    return res.json({ count: playerCount });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
