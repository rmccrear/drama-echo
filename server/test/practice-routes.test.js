const dialogRoutes = require("../src/api-routes/dialogs.js");
// const practiceRoutes = require("../src/api-routes/practice.js");

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
jest.mock("../src/my-auth");
jest.mock("../src/api-routes/controllers/cloudinary-controller");

const { Dialog } = require("./../src/db/models/dialogs");
const { Practice } = require("../src/db/models/practices");
const dbSeeds = require("./db-seeds");

const app = express();
app.use(express.json());
app.use(dialogRoutes);

let testDialogs, testPractices;

describe("Test Practice Routes", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    const dialogSeeds = dbSeeds.dialogs;
    dialogSeeds.forEach((dialog, idx) => {
      dialog.lines = dbSeeds.lines[idx];
    });
    testDialogs = await Dialog.insertMany(dbSeeds.dialogs);
    testPractices = await Practice.insertMany(dbSeeds.practices);
  });
  afterEach(async () => {
    testDialogs = undefined;
    testPractices = undefined;
    await Dialog.deleteMany();
    await Practice.deleteMany();
  });

  test("get Practice list", async () => {
    const resp = await request(app).get(`/api/v1/practice`);
    const practiceList = resp.body;
    expect(practiceList.length).toBe(1);
  });

  test("create Practice using dialog_id", async () => {
    // const user_sub = "1";
    const dialog_id = testDialogs[0]._id.toString(); // dialog 0 does not have a practice yet, so we can create it.
    characterIdx = 1;
    const practiceParams = {
      characterIdx,
    };
    const resp = await request(app)
      .post(`/api/v1/practice/${dialog_id}`)
      .send(practiceParams);
    expect(resp.body.characterIdx).toBe(1);
    expect(resp.body.user_sub).toBe("1");
    expect(resp.body.dialog_id).toBe(dialog_id);
    const resp2 = await request(app).get(`/api/v1/practice/${dialog_id}`);
    expect(resp2.body.characterIdx).toBe(1);
    expect(resp2.body.user_sub).toBe("1");
    expect(resp2.body.dialog_id).toBe(dialog_id);
    // second create should not make a new practice...
    //const resp3 = await request(app)
    //  .post(`/api/v1/practice/${dialog_id}`)
    //  .send(practiceParams);
  });
  test("get Practice using dialog_id", async () => {
    const dialog_id = testPractices[0].dialog_id; // this should be The Second Dialog. It already has a practice for user_sub: "1"
    const resp = await request(app).get(`/api/v1/practice/${dialog_id}`); // get for user "1"
    expect(resp.body._id).toBe(testPractices[0]._id.toString());
    expect(resp.body.dialog_id).toBe(dialog_id);
    expect(resp.body.characterIdx).toBe(0);
  });
  test("update Practice", async () => {
    // update uses practice_id
    const practice_id = testPractices[0]._id; // this should be The Second Dialog. It already has a practice for user_sub: "1"
    characterIdx = 1;
    const practiceParams = {
      characterIdx,
    };
    const resp = await request(app)
      .put(`/api/v1/practice/${practice_id}`)
      .send(practiceParams); // get for user "1"
    expect(resp.body.characterIdx).toBe(1);
    //getting by dialog_id and user_sub works too.
    const dialog_id = testPractices[0].dialog_id;
    const resp2 = await request(app).get(`/api/v1/practice/${dialog_id}`);
    expect(resp2.body.characterIdx).toBe(1);
  });
  test("delete Practice", async () => {
    const practice_id = testPractices[0]._id.toString();
    const dialog_id = testPractices[0].dialog_id;
    const resp = await request(app).delete(`/api/v1/practice/${practice_id}`);
    expect(resp.body._id).toBe(practice_id);
    const resp2 = await request(app).get(`/api/v1/practice/${dialog_id}`); // get for user "1"
    expect(resp2.error.status).toBe(404);
  });
});
