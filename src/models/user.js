const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw Error('Email is invalid!');
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 7,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
