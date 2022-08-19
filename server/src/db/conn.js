const { MongoClient } = require("mongodb");
const connectionString = process.env.MONGO_URL;

const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connect: () =>
    new Promise((resolve, reject) => {
      client.connect((err, db) => {
        if (err || !db) {
          throw new Error(err);
        } else {
          dbConnection = db.db("drama_echo");
          console.log("Connected to MongoDB");
          resolve();
        }
      });
    }),
  getDb: () => dbConnection,
  close: () => client.close(),
};
