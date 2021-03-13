const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://localhost/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
    validate: value => {
      if (!validator.isEmail(value)) {
        throw Error('Email is invalid!');
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
  },
});

const User = mongoose.model('User', UserSchema);
const instance = new User({
  name: ' Suyeon',
  email: 'suyeon',
  password: 155,
});

instance
  .save()
  .then(() => console.log(instance))
  .catch(err => console.log(err));
