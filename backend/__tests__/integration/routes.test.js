// const request = require('supertest');
// const app = require('../../app');
// const db = require('../../db');

// process.env.NODE_ENV = 'test';

// let first_user_username;


// beforeEach(async () => {
//   const firstUserQuery = await db.query(`
//   INSERT INTO users ( username, password, first_name, last_name, email, photo_url, is_admin ) 
//   VALUES ('H_Blazer', 'iLuvJ.O.', 'Hasier', 'Pastor', 'pastor@hasier.com', 'http://pix.com/gross.jpeg', true) 
//   RETURNING username, first_name, last_name, email, photo_url
//   `);
//   await db.query(`
//   INSERT INTO users ( username, password, first_name, last_name, email, photo_url, is_admin ) 
//   VALUES ('Juanjoo', 'Juanjo', 'Diego', 'Diego', 'juan@diego.com', 'http://pix.com/gross.jpeg', false) 
//   RETURNING username, first_name, last_name, email, photo_url
//   `);

//   first_user_username = firstUserQuery.rows[0].username
// });


// afterEach(async () => {
//   await db.query(`DELETE FROM users`);
// });

// afterAll(async () => {
//   await db.end();
// });

// describe('GET /', () => {
//   it('it should return a list of all users with their info', async function () {
//     let response = await request(app).get('/users');
//     expect(response.status).toEqual(200);
//     expect(response.body.users.length).toEqual(2);
//     expect(Object.keys(response.body.users[0]).length).toEqual(5);
//   });

// });