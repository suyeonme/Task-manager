const express = require('express');
const auth = require('../middleware/auth');
const router = new express.Router();
const Task = require('../models/task');

router.post('/task', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    await res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

// GET task?completed=true
router.get('/tasks', auth, async (req, res) => {
  try {
    // Filtering Data
    const match = {};
    const isDone = req.query.isDone;

    if (isDone) {
      match.isDone = req.query.isDone === 'true';
    }

    await req.user
      .populate({
        path: 'task',
        match,
      })
      .execPopulate();
    res.send(req.user.task);
  } catch (err) {
    res.status(500).send();
  }
});

router.get('/task/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) res.status(404).send();
    res.send(task);
  } catch (err) {
    res.status(500).send();
  }
});

router.patch('/task/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowed = ['isDone', 'description'];
  const isValid = updates.every(update => allowed.includes(update));

  if (!isValid) {
    return res.status(400).send({ error: 'Invalid Updates.' });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) res.status(404).send();

    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (er) {
    res.status(400).send();
  }
});

router.delete('/task/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) res.status(404).send();
    res.send(task);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
