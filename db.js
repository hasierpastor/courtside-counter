// const app = require('./app');
// const MongoClient = require('mongodb').MongoClient;

// //set up a connection to the server running on localhost (mongod)
// const mongo = new MongoClient('mongodb://localhost:27017', {
//   useNewUrlParser: true
// });

// let db;

// /**
//  * Database connection and server set-up
//  */
// mongo.connect(function(error) {
//   // a standard Node.js "error-first" callback
//   if (error) {
//     // kill express if we cannot connect to the database server
//     console.error(error);
//     process.exit(1);
//   }

//   // if we reach this line, we've made it
//   console.log('Successfully connected to database');
//   // set the active database
//   db = mongo.db('basketball_db');

//   // standard express app.listen
//   app.listen(3333, function() {
//     console.log('Courtside Counter API Server listening on port 3333.');
//   });
// });

// module.exports = db;
