const express = require('express');
const router = new express.Router();
const User = require('../models/user');

router.post('/users', async (req, res) => {
  const user = new User(req.body); // Get from request on frontend
  try {
    await user.save();
    const token = await user.generateAuthToken();
    await res.send({ user, token });
    await res.status(201).send(user);
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
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send();
  }
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
