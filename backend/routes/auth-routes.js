const express = require('express');
const router = new express.Router();
const { validateSignupSchema, validateLoginSchema } = require('../schema');
const validateJSONSchema = require('../middleware/validateJSONSchema');

const Auth = require('../models/Auth');

router.post('/signup', validateJSONSchema(validateSignupSchema), async function(
  req,
  res,
  next
) {
  try {
    let user = req.body;
    let response = await Auth.signup(user);
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
    let response = await Auth.login(userEmail);
    res.json({ _token: response });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
