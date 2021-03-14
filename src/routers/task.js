const express = require('express');
const router = new express.Router();
const Task = require('../models/task');

router.post('/task', async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    await res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/task', async (req, res) => {
  try {
    const tasks = await Task.find();
    await res.send(tasks);
  } catch (err) {
    res.status(500).send();
  }
});

router.get('/task/:id', async (req, res) => {
  const _ID = req.params.id;
  try {
    const task = await Task.findById(_ID);
    if (!task) res.status(404).send();
    res.send(task);
  } catch (err) {
    res.status(500).send();
  }
});

router.patch('/task/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowed = ['isDone', 'description'];
  const isValid = updates.every(update => allowed.includes(update));

  if (!isValid) {
    return res.status(400).send({ error: 'Invalid Updates.' });
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) res.status(404).send();
    res.send(task);
  } catch (er) {
    res.status(400).send();
  }
});

router.delete('/task/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) res.status(404).send();
    res.send(task);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
