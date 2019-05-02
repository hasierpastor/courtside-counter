const mongoUtil = require('../db/mongoUtil');
const db = mongoUtil.get();
const {otw} = require('../db/constants');


class OTW {

  static async getOTW() {
    let result = await db
      .collection(otw)
      .find()
      .toArray();

      return result;
  }

  static async removeOTW(otwEmail) {
    await db
      .collection(otw)
      .deleteOne({ email: { $eq: otwEmail } });
    return;
  }

  static async addOTW(otwPlayer, distance, timestamp) {
    await db
    .collection(otw)
    .updateOne({ email: { $eq: otwPlayer.email } }, {$set: {distance: distance, timestamp: timestamp, name: otwPlayer.name}}, {upsert: true});
    return;
  }

}

module.exports = OTW;