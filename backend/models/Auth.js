const jwt = require('jsonwebtoken');
const { SECRET } = require('../../frontend/src/secret');
const mongoUtil = require('../mongoUtil');
const db = mongoUtil.get();
const { UserNotFoundError } = require('../errors');

class Auth {

  static async signup(user) {
    let userEmail = user.email;
    let userFound = await db
      .collection('users')
      .findOne({ email: { $eq: userEmail } });
    let token
    if (userFound === null) {
      token = jwt.sign(user, SECRET);
      await db.collection('users').insertOne(user);
    } else {
      token = jwt.sign(userFound, SECRET);
    }
    return token;
  }

  static async login(userEmail) {
    let userFound = await db
    .collection('users')
    .findOne({ email: { $eq: userEmail } });
  if (userFound === null) {
    throw new UserNotFoundError();
  } else {
    return jwt.sign(userFound, SECRET);
  }

  }

}

module.exports = Auth;