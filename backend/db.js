const {MongoClient} = require('mongodb');

const {DB_URI} = require('./config');

const state = {
  db: null,
}

exports.connect = function(done) {
  if (state.db) return done()

  MongoClient.connect(DB_URI, function(err, db) {
    if (err) return done(err)
    state.db = db
    done()
  })
}

exports.get = function() {
  return state.db
}

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
}