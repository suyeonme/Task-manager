const express = require('express');

const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

router.post('/users', async (req, res) => {
  // Signup
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token }); // UserSchema.methods.toJSON
  } catch (e) {
    res.status(400).send();
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      token => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

router.get('/users/:id', async (req, res) => {
  const _ID = req.params.id;
  try {
    const user = await User.findById(_ID);
    if (!user) res.status(404).send();
    res.send(user);
  } catch (err) {
    res.status(500).send();
  }
});

router.patch('/users/:id', async (req, res) => {
  // Prevent to update when user send unallowed property
  const updates = Object.keys(req.body);
  const allowed = ['name', 'email', 'password'];
  const isValid = updates.every(update => allowed.includes(update));

  if (!isValid) {
    return res.status(400).send({ error: 'Invalid Updates.' });
  }

  try {
    // Apply Middleware
    const user = await User.findById(req.params.id);
    updates.forEach(update => (user[update] = req.body[update]));
    await user.save();

    if (!user) res.status(404).send();
    res.send(user);
  } catch (er) {
    res.status(400).send();
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) res.status(404).send();
    res.send(user);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
