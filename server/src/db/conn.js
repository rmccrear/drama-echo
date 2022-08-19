const { MongoClient } = require('mongodb');
connectionString = process.env.ATLAS_URI;

const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let dbConnection;

module.exports = {
    connectToServer: (callback) => {
      client.connect((err, db)=>{
        if(err || !db){
            return callback(err);
        }
        dbConnection = db.db('drama_echo');
        console.log('Connected to MongoDB');
        return callback();
      });
    },
    getDb: () => dbConnection
};
