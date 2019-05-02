const mongoUtil = require('../db/mongoUtil');
const { players } = require('../db/constants');
const db = mongoUtil.get();
const { PlayerCheckedInError } = require('../errors');
const { getDistanceInMiles } = require('../helpers/getDistanceInMi');
const LAT_LOWER = 37.883581;
const LONG_LOWER = -122.269655;
const LAT_UPPER = 37.883284;
const LONG_UPPER = -122.269609;

const OTW = require('./OTW');

class Player {
  static async checkinPlayer(email, name, lat, long, timestamp) {
    //distance the player is from the court
    let distance = getDistanceInMiles(lat, long, LAT_LOWER, LONG_LOWER);
    //boolean which is true if plyer at court/false if player on the way => move logic to helpers
    let isAtCourt =
      lat < LAT_LOWER &&
      lat > LAT_UPPER &&
      long < LONG_LOWER &&
      long > LONG_UPPER;
    //TODO: SORT PLAYERS BY TIMESTAMP
    if (isAtCourt) {
      await db
        .collection(players)
        .updateOne(
          { email: { $eq: email } },
          { $set: { name, timestamp } },
          { upsert: true }
        );

      let addPlayer = { name, email, timestamp };
      return {
        message: 'Checked into court',
        player: addPlayer,
        distance,
        isAtCourt
      };
    }

    if (!isAtCourt) {
      //players on the way also have a distance property (calculated above)
      let otwPlayer = { name, email };
      console.log(otwPlayer);
      await OTW.addOTW(otwPlayer, distance, timestamp);
      return {
        message: 'Added to OTW',
        player: otwPlayer,
        distance,
        isAtCourt
      };
    } else {
      throw new PlayerCheckedInError();
    }
  }

  static async removePlayer(playerEmail) {
    await db.collection(players).deleteOne({ email: { $eq: playerEmail } });
    return;
  }

  static async getPlayers() {
    return await db
      .collection(players)
      .find()
      .toArray();
  }

  static async countPlayers() {
    return await db.collection('players').count();
  }
}

module.exports = Player;
