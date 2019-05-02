const mongoUtil = require('../mongoUtil');
const db = mongoUtil.get();

class OTW {

  static async getOTW() {
    let result = await db
      .collection('otw')
      .find()
      .toArray();

      return result;
  }

  static async removeOTW(otwEmail) {
    await db
      .collection('otw')
      .deleteOne({ email: { $eq: otwEmail } });
    return;
  }

  static async addOTW(otwPlayer) {
    await db
      .collection('otw')
      .insertOne(otwPlayer);
    return;
  }

}

module.exports = OTW;