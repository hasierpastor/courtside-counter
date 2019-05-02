

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