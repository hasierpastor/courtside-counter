const express = require('express');
const router = new express.Router();
const { authenticateUser } = require('../middleware/authenticateUser');

const OTW = require('../models/OTW');

/**
 * Route handler for GET to /otw => return players that are on the way to the court (array)
 */
router.get('/', authenticateUser, async function(req, res, next) {
  try {
    let response = await OTW.getOTWs();
    return res.json({'otw': response});
  } catch (err) {
    next(err);
  }
});

/**
 * Route handler for DELETE to /otw => removes players that are on the way to court
 * /SHOULD THIS BE CALLED WHEN PLAYERS UPDATE LOCATION AND ARE AT THE COURT? => MOVE FROM OTW TO AT THE COURT
 */
router.delete('/', authenticateUser, async function(req, res, next) {
  try {
    let otwEmail = req.body.email;
    await OTW.removeOTW(otwEmail);
    return res.json({
      message: 'Success',
      otwEmail
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;