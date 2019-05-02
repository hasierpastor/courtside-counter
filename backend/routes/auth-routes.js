app.post('/signup', validateJSONSchema(validateSignupSchema), async function(
  req,
  res,
  next
) {
  try {
    let userEmail = req.body.email;
    let newUser = req.body;
    let userFound = await db
      .get()
      .collection('users')
      .findOne({ email: { $eq: userEmail } });
    if (userFound === null) {
      let token = jwt.sign(newUser, SECRET);
      await db
        .get()
        .collection('users')
        .insertOne(newUser);
      return res.json({ _token: token });
    } else {
      let token = jwt.sign(userFound, SECRET);
      return res.json({ _token: token });
    }
  } catch (err) {
    next(err);
  }
});

/**
 * Route handler for POST to /login => allows a player to login to Courtside Counter
 * If player not signed up return an error, otherwise login player and return JWT
 */

app.post('/login', validateJSONSchema(validateLoginSchema), async function(
  req,
  res,
  next
) {
  console.dir('db', db.get());
  let dbget = db.get();
  let users = db.get().collection('users');
  let userEmail = req.body.email;
  let userFound = await users.findOne({ email: { $eq: userEmail } });
  if (userFound === null) {
    let err = new UserNotFoundError();
    next(err);
  } else {
    let token = jwt.sign(userFound, SECRET);
    res.json(token);
  }
});