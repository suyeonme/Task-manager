const express = require('express');
require('./db/mongoose'); // Connect mongose to mongoDB
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

app.use(express.json()); // Convert json to object
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
