const express = require('express');
require('./db/mongoose'); // Connect mongose to mongoDB
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT | 3000;

app.use(express.json()); // Convert json to object
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log('Server is up on ' + port);
});
