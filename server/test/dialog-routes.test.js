const dialogRoutes = require("../src/api-routes/dialogs.js");

const request = require("supertest");
const express = require("express");
const app = express();

const {MongoClient} = require('mongodb');
const dbo = require('../src/db/conn');

const dbSeeds = require('./db-seeds');

app.use(express.json());
app.use(dialogRoutes);

describe('get Dialogs', () => {
  beforeAll(async () => {
    await dbo.connect();
    const db = dbo.getDb();
    const dialogsCollection = await db.collection('dialogs')
    await dialogsCollection.insertMany(dbSeeds.dialogs);
  });

  afterAll(async () => {
      dbo.close();
  });

  test("dialog route works", async () => {
    const resp = await request(app).get('/dialogs');
    expect(resp.body[0].title).toBe("First Dialog");
    expect(resp.body[1].title).toBe("Second Dialog");
  });
});
