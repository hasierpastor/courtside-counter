const request = require('supertest');
const app = require('../../app');
const mongoUtil = require('../../db/mongoUtil');
const ObjectId = require('mongodb').ObjectID;

let db;

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
    mongoUtil.connect();
    db = mongoUtil.get();
  });

  afterAll(async () => {
    await db.close(function(err) {
      if(err) console.log(err);
      console.log('db closed');
    });
  });

  it('it should signup a user', async () => {
    const mockUser = { _id: '123abc', email: 'john@john.com', name: 'John' };

    let response1 = await request(app)
      .post('/signup')
      .send(mockUser);

    const insertedUser = await db
      .collection('users')
      .findOne({ _id: '123abc'});

    expect(Object.keys(response1.body)[0]).toEqual('_token');
    expect(insertedUser).toEqual(mockUser);
  });
});
