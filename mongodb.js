const { MongoClient, ObjectID } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'task-manager';

MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
  if (error) {
    return console.log('Unable to connect database');
  }

  const db = client.db(dbName);

  db.collection('users')
    .deleteMany({
      age: 26,
    })
    .then(res => console.log(res))
    .catch(err => console.log(err));
});
