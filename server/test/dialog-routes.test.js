const dialogRoutes = require("../src/api-routes/dialogs.js");

const request = require("supertest");
const express = require("express");
jest.mock("../src/my-auth");
const app = express();

const dbo = require("../src/db/conn");

const dbSeeds = require("./db-seeds");

const testDialog1 = dbSeeds.dialogs[0];
console.log("testDialog1", testDialog1)
app.use(express.json());
app.use(dialogRoutes);

describe("get Dialogs", () => {
  beforeAll(async () => {
    await dbo.connect();
    const db = dbo.getDb();
    const dialogsCollection = await db.collection("dialogs");
    await dialogsCollection.insertMany(dbSeeds.dialogs);
    console.log("testDialog1", testDialog1)
  });

  afterAll(async () => {
    dbo.close();
  });

  test("list dialogs route works", async () => {
    const resp = await request(app).get("/api/v1/dialogs");
    expect(resp.body[0].title).toBe("First Dialog");
    expect(resp.body[1].title).toBe("Second Dialog");
  });
  test("get dialog by id route works", async () => {
    const dialog_id = testDialog1._id;
    console.log("dialog_id", dialog_id)
    const resp = await request(app).get(`/api/v1/dialogs/${dialog_id}`);
    expect(resp.body.title).toBe("First Dialog");
  });


});
