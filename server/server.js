require('dotenv').config({ path: './config.env' });

const express = require('express');
const cors = require('cors');
// get MongoDB driver connection
const dbo = require('./src/db/conn');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(require('./src/api-routes/dialogs'));

const startServer = async () => {
    try {
        await dbo.connect();
    }
    catch (err){
        console.log(err);
        process.exit();
    }
    app.listen(PORT, () => {
        console.log('Running on port: ', PORT);
    });
}
startServer();

