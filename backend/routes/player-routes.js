const express = require('express');
const router = new express.Router();
const { authenticateUser } = require('../middleware/authenticateUser');
const { getDistanceInMiles } = require('../helpers/getDistanceInMi');
const mongoUtil = require('../db/mongoUtil');
const db = mongoUtil.get();
const { PlayerCheckedInError } = require('../errors');

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
    let {lat, long, timestamp } = req.body;
    let {email, name} = req;
    let response = await Player.checkinPlayer(
      email,
      name,
      lat,
      long,
      timestamp
    );
    let { message, player, distance, isAtCourt } = response;
    return res.json({ message, player, isAtCourt, distance });
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
    let isInPlayers = await Player.checkStatus(req.email);
    let isInOTW = await OTW.checkStatus(req.email);
    let status = Boolean(isInOTW || isInPlayers);
    return res.json({ isCheckedIn: status });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
