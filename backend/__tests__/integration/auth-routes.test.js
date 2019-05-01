const { MongoClient } = require('mongodb');
const request = require('supertest');
const app = require('../../app');
const DBManager = require('../../DBManager');
const { DB_PORT, DB_NAME } = require('../../config');
const dbman = new DBManager(DB_PORT, DB_NAME);
const uuid = require('uuid');

// beforeEach(async () => {
//   const user1 = {
//     _id: 1,
//     email: "juan@juan.com",
//     name: "Juan Areces",
//   }
//   const user2 = {
//     _id: 2,
//     email: "hasier@hasier.com",
//     name: "Hasier Pastor",
//   }
//   const user3 = {
//     _id: 3,
//     email: "silas@silas.com",
//     name: "Silas Burger",
//   }
//   await db.collection('users').insertMany([user1, user2, user3]);
// });

describe('POST /signup', () => {
  beforeAll(async () => {
    console.log(await dbman.server.getDbName(), await dbman.server.getPort(),await dbman.server.getConnectionString() );
    await dbman.start();
  });

  afterAll(async () => {
    await dbman.stop();
  });

  it('it should signup a user', async () => {
    const mockUser = { _id: uuid(), email: 'john@john.com', name: 'John' };

    let response1 = await request(app)
      .post('/signup')
      .send(mockUser);
    console.log(response1.body);
    console.log(Object.keys(response1.body)[0]);

    const insertedUser = await dbman.db
      .collection('users')
      .findOne({ email: { $eq: 'john@john.com' } });

    expect(Object.keys(response1.body)[0]).toEqual('_token');
    expect(insertedUser).toEqual(mockUser);
  });
});
