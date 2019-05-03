const mongoUtil = require('../db/mongoUtil');
const db = mongoUtil.get();
const {otw} = require('../db/constants');


class OTW {

  static async getOTWs() {
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

  static async addOTW(otwEmail, name, distance, timestamp) {
    await db
    .collection(otw)
    .updateOne({ email: { $eq: otwEmail } }, {$set: {distance, timestamp, name}}, {upsert: true});
    return;
  }

  static async getOTW(playerEmail) {
    return await db.collection(otw).findOne({ email: { $eq: playerEmail } });
  }

}

module.exports = OTW;