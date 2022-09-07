const express = require("express");
const mongoose = require("mongoose");
jest.mock("../src/my-auth");

const {
  validatePublicId,
} = require("../src/api-routes/controllers/cloudinary-controller");

const app = express();

// const dbo = require("../src/db/conn");

const { Dialog } = require("./../src/db/models/dialogs");
const dbSeeds = require("./db-seeds");

app.use(express.json());
// app.use(dialogRoutes);

const echodialog_lines = process.env.CLOUDINARY_REMOTE_LINES_OF_DIALOG_FOLDER;
const echodialog_dialogdemos =
  process.env.CLOUDINARY_REMOTE_DIALOG_DEMOS_FOLDER;
const echodialog_echoes = process.env.CLOUDINARY_REMOTE_ECHOES_FOLDER;

let testDialogs;

describe("cloudinary routes", () => {
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
    testDialogs = await Dialog.insertMany(dialogSeeds);
  });
  afterEach(async () => {
    testDialogs = undefined;
    await Dialog.deleteMany();
  });

  test("checks if upload is valid", async () => {
    const dialog = await Dialog.findOne({
      user_sub: "1",
      lines: { $exists: true, $ne: [] },
    });
    console.log(dialog);
    const validDialogdemoId = dialog._id.toString();
    const isValidDialogdemo = await validatePublicId(
      "1",
      validDialogdemoId,
      "echodialog_dialogdemos"
    );
    expect(isValidDialogdemo).toBe(true);

    const line = dialog.lines[0];
    const validLinePublicId = `${dialog._id.toString()}--${line._id.toString()}`;
    const isValidLinePublicId = await validatePublicId(
      "1",
      validLinePublicId,
      "echodialog_lines"
    );
    expect(isValidLinePublicId).toBe(true);
  });
});
