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
        console.log(error)
        res.status(400).send({error: "Error fetching dialogs"});
    }

});

module.exports=dialogRoutes;
