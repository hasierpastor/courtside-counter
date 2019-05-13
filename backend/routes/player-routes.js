const express = require('express');
const router = new express.Router();
const { authenticateUser } = require('../middleware/authenticateUser');

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
 * Route handler for DELETE to /players => removes players that are on the way to court
 */
router.delete('/', authenticateUser, async function(req, res, next) {
  try {
    let playerEmail = req.email;
    await Player.removePlayers(playerEmail);
    return res.json({
      message: 'Success',
      playerEmail
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


module.exports = router;
