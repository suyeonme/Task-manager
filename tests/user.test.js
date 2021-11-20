const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// mockup Data
const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'Hanna',
  email: 'hanna@gmail.com',
  password: 'hanna1234',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

beforeEach(async () => {
  await User.deleteMany(); // clear db
  await new User(userOne).save();
});

test('Should signup a new user', async () => {
  const res = await request(app)
    .post('/users')
    .send({
      name: 'Suyeon',
      email: 'suyeonme@gmail.com',
      password: 'suyeonme1234',
    })
    .expect(201);

  // Assert that the db was changed correctly
  const user = await User.findById(res.body.user._id);
  expect(user).not.toBeNull();

  // Assrtions about the response
  expect(res.body).toMatchObject({
    user: {
      name: 'Suyeon',
      email: 'suyeonme@gmail.com',
    },
    token: user.tokens[0].token,
  });
});

test('Should login existing user', async () => {
  const res = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  // Assert that the user's token was saved correctly
  const user = await User.findById(res.body.user._id);
  expect(res.body.token).toBe(user.tokens[1].token);
});

test('Should not login non-existing user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: 'thisisbadpassword!',
    })
    .expect(400);
});

test('Should delete account', async () => {
  const res = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`) // 유효한 토큰일 경우
    .send({
      email: userOne.email,
      name: userOne.name,
    })
    .expect(200);

  const user = await User.findById(userOne._id);
  expect(user).toBeNull();
});

test('Should not delete account', async () => {
  await request(app)
    .delete('/users/me')
    .send({
      email: userOne.email,
      name: userOne.name,
    })
    .expect(401);
});

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/test-image.png')
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ name: 'James' })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toBe('James');
});

test('Should not update invalid valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ age: 26 })
    .expect(400);
});

// Authentication
test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`) // 유효한 토큰일 경우
    .send()
    .expect(200);
});

test('Should not get profile for user', async () => {
  await request(app).get('/users/me').send().expect(401);
});
