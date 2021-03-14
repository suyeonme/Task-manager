const express = require('express');
require('./db/mongoose'); // Connect mongose to mongoDB
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT | 3000;

app.use(express.json()); // Convert json to object

// USERS
app.post('/users', async (req, res) => {
  const user = new User(req.body); // Get from request on frontend
  try {
    await user.save();
    await res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send();
  }
});

app.get('/users/:id', async (req, res) => {
  const _ID = req.params.id;
  try {
    const user = await User.findById(_ID);
    if (!user) res.status(404).send();
    res.send(user);
  } catch (err) {
    res.status(500).send();
  }
});

app.patch('/users/:id', async (req, res) => {
  // Prevent to update when user send unallowed property
  const updates = Object.keys(req.body);
  const allowed = ['name', 'email', 'password'];
  const isValid = updates.every(update => allowed.includes(update));

  if (!isValid) {
    return res.status(400).send({ error: 'Invalid Updates.' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) res.status(404).send();
    res.send(user);
  } catch (er) {
    res.status(400).send();
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) res.status(404).send();
    res.send(user);
  } catch (err) {
    res.status(500).send();
  }
});

// TASKS
app.post('/task', async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    await res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/task', async (req, res) => {
  try {
    const tasks = await Task.find();
    await res.send(tasks);
  } catch (err) {
    res.status(500).send();
  }
});

app.get('/task/:id', async (req, res) => {
  const _ID = req.params.id;
  try {
    const task = await Task.findById(_ID);
    if (!task) res.status(404).send();
    res.send(task);
  } catch (err) {
    res.status(500).send();
  }
});

app.patch('/task/:id', async (req, res) => {
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

app.delete('/task/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) res.status(404).send();
    res.send(task);
  } catch (err) {
    res.status(500).send();
  }
});

app.listen(port, () => {
  console.log('Server is up on ' + port);
});
