const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

// mockup data
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

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: 'Suyeon Kang',
  email: 'suyeon@gmail.com',
  password: 'suyeon1234',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'First Task',
  isDone: false,
  owner: userOneId._id,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Second Task',
  isDone: true,
  owner: userOneId._id,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Third Task',
  isDone: true,
  owner: userTwoId._id,
};

const setupDatabase = async () => {
  // clear db
  await User.deleteMany();
  await Task.deleteMany();

  // create a new user and task
  await new User(userOne).save();
  await new User(userTwo).save();

  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwo,
  taskOne,
  setupDatabase,
};
