const request = require('supertest');
const app = require('../src/app');

test('Should signup a new user', async () => {
  await request(app)
    .post('/users')
    .send({
      name: 'Suyeon',
      email: 'suyeondf@gmail.com',
      password: 'adsfkasdfasdf',
    })
    .expect(201);
});
