const dialogRoutes = require("../src/api-routes/dialogs.js");

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
jest.mock("../src/my-auth");
const app = express();

// const dbo = require("../src/db/conn");

const { Dialog } = require("./../src/db/models/dialogs");
const dbSeeds = require("./db-seeds");

app.use(express.json());
app.use(dialogRoutes);

let testDialogs;

describe("get Dialogs", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    testDialogs = await Dialog.insertMany(dbSeeds.dialogs);
  });
  afterEach(async () => {
    testDialogs = undefined;
    await Dialog.deleteMany();
  });

  test("list dialogs route works", async () => {
    const resp = await request(app).get("/api/v1/dialogs");
    expect(resp.body[0].title).toBe("First Dialog");
    expect(resp.body[1].title).toBe("Second Dialog");
  });
  test("get dialog by id route works", async () => {
    const dialog_id = testDialogs[0]._id.toString();
    const resp = await request(app).get(`/api/v1/dialogs/${dialog_id}`);
    const firstDialogTitle = testDialogs[0].title;
    expect(resp.body.title).toBe(firstDialogTitle);
  });
  test("create dialog route works", async () => {
    const dialogParams = { title: "Created Title", characters: ["J", "A"] };
    const resp = await request(app).post(`/api/v1/dialogs`).send(dialogParams);
    expect(resp.body.title).toBe("Created Title");
    const new_id = resp.body._id;
    const resp2 = await request(app).get(`/api/v1/dialogs/${new_id}`);
    expect(resp2.body.title).toBe("Created Title");
  });
  test("update dialog route works", async () => {
    const dialog_id = testDialogs[0]._id.toString();
    const dialogUpdates = { title: "Updated Title" };
    //await request(app).put(`/api/v1/dialogs/${dialog_id}`).send({...testDialogs[0], title: "Updated Title"});
    await request(app).put(`/api/v1/dialogs/${dialog_id}`).send(dialogUpdates);
    const resp = await request(app).get(`/api/v1/dialogs/${dialog_id}`);
    expect(resp.body.title).toBe("Updated Title");
  });
  test("update dialog route with validation works", async () => {
    const dialog_id = testDialogs[0]._id.toString();
    const dialogUpdates = { title2: "not in schema" };
    //await request(app).put(`/api/v1/dialogs/${dialog_id}`).send({...testDialogs[0], title: "Updated Title"});
    await request(app).put(`/api/v1/dialogs/${dialog_id}`).send(dialogUpdates);
    const resp = await request(app).get(`/api/v1/dialogs/${dialog_id}`);
    expect(resp.body.title2).toBeUndefined();
  });
  test("delete dialog by id route works", async () => {
    const dialog_id = testDialogs[0]._id.toString();
    const resp = await request(app).delete(`/api/v1/dialogs/${dialog_id}`);
    const resp2 = await request(app).get(`/api/v1/dialogs/${dialog_id}`);
    expect(resp2.body.title).toBeUndefined();
  });
});
