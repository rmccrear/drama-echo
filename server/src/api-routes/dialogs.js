const express = require('express');

const dialogRoutes = express.Router();

const dbo = require('../db/conn');

dialogRoutes.route('/dialogs').get(async (_req, res) =>{
    const db = dbo.getDb();
    try{
      const cursor = await db.collection('dialogs')
          .find({})
          .limit(20);
      const dialogs = await cursor.toArray();
      res.json(dialogs);
    }
    catch (error) {
        res.status(400).send('Error fetching listings!');
    }

});

module.exports=dialogRoutes;
