const mongoUtil = require('../mongoUtil');
const db = mongoUtil.get();
const { PlayerCheckedInError } = require('../errors');


const OTW = require('./OTW');

class Player {
  static async checkinPlayer(player, isAtCourt, distance) {
    let foundPlayer = await db
      .get()
      .collection('players')
      .findOne({ email: { $eq: player.email } });
    //TODO: SORT PLAYERS BY TIMESTAMP
    if (foundPlayer === null && isAtCourt) {
      let newPlayer = { name: player.name, email: player.email };
      await db.collection('players').insertOne(newPlayer);
      return {
        message: 'Success',
        player: newPlayer
      };
    }
    if (foundPlayer === null && !isAtCourt) {
      //players on the way also have a distance property (calculated above)
      let otwPlayer = { name: player.name, email: player.email, distance };
      await OTW.addOTW(otwPlayer);
      return {
        message: 'Added to OTW',
        player: otwPlayer
      };
    } else {
      throw new PlayerCheckedInError();
    }
  }

  static async removePlayer(playerEmail) {
    await db.collection('players').deleteOne({ email: { $eq: playerEmail } });
    return;
  }

  static async getPlayers() {
    return await db
    .collection('players')
    .find()
    .toArray();
  }

  static async countPlayers() {
    return await db.collection('players').count();
  }

}

module.exports = Player;
