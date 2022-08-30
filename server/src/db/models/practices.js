const mongoose = require("mongoose");
const { dialogSchema } = require("./dialogs");

const echoSchema = new mongoose.Schema({
  echoAudioUrl: String,
  user_sub: String,
});

const practiceSchema = new mongoose.Schema({
  user_sub: String,
  dialog_id: String,
  characterIdx: Number,
  echoes: [echoSchema],
  dialog: dialogSchema,
});

const Practice = mongoose.model("Practice", practiceSchema);

module.exports = { Practice };
