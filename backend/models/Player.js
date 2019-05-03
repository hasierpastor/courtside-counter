const mongoUtil = require('../db/mongoUtil');
const { players } = require('../db/constants');
const db = mongoUtil.get();

class Player {
  static async addPlayer(playerEmail, name, lat, long, timestamp, distance) {
    await db
    .collection(players)
    .updateOne(
      { email: { $eq: playerEmail } },
      { $set: { name, timestamp, distance } },
      { upsert: true }
    );
    return;
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
    return await db.collection(players).count();
  }

  static async getPlayer(playerEmail) {
    return await db.collection(players).findOne({ email: { $eq: playerEmail } });
  }
}

module.exports = Player;
