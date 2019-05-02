/**
 * Route handler for GET to /otw => return players that are on the way to the court (array)
 */
app.get('/otw', authenticateUser, async function(req, res, next) {
  try {
    let result = await dbman.db
      .collection('playersotw')
      .find()
      .toArray();
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * Route handler for DELETE to /otw => removes players that are on the way to court
 * /SHOULD THIS BE CALLED WHEN PLAYERS UPDATE LOCATION AND ARE AT THE COURT? => MOVE FROM OTW TO AT THE COURT
 */
app.delete('/otw', authenticateUser, async function(req, res, next) {
  try {
    let playerEmail = req.body.email;
    await dbman.db
      .collection('otw')
      .deleteOne({ email: { $eq: playerEmail } });
    return res.json({
      status: 'You have successfully updated your location!',
      playerEmail
    });
  } catch (err) {
    next(err);
  }
});