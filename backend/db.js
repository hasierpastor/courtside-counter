const { MongoClient } = require('mongodb');
const { DB_URI, DB_NAME } = require('./config');

const state = {
  db: null
};

exports.connect = function(done) {
  if (state.db) return done();

  MongoClient.connect(DB_URI, { useNewUrlParser: true }, function(err, client) {
    if (err) return done(err);
    state.db = client.db(DB_NAME);
    done();
  });
};

exports.get = function() {
  console.log(state);
  return state.db;
};

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err) {
      state.db = null;
      state.mode = null;
      done(err);
    });
  }
};
