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

// Filtering and paginating data
// GET task?completed=true
// GET task?limit=10&skip=2
// GET task?sortBy=createdAt:desc
router.get('/task', auth, async (req, res) => {
  try {
    const match = {};
    const sort = {};

    const isDone = req.query.isDone;
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);
    const sortBy = req.query.sortBy;

    if (isDone) {
      match.isDone = req.query.isDone === 'true';
    }

    if (sortBy) {
      const parts = sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    // Populate virtuals
    await req.user
      .populate({
        path: 'task',
        match,
        options: {
          limit,
          skip,
          sort,
        },
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
