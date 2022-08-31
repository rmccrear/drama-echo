const mongoose = require("mongoose");
const { dialogSchema } = require("./dialogs");

const echoSchema = new mongoose.Schema({
  echoAudioUrl: String,
  user_sub: String,
});

const practiceSchema = new mongoose.Schema({
  user_sub: { type: String, index: true },
  dialog_id: { type: String, index: true },
  characterIdx: Number,
  echoes: [echoSchema],
  dialog: dialogSchema,
});
practiceSchema.index(
  { user_sub: 1, dialog_id: 1 },
  { unique: true, name: "query practice by dialog_id and user_sub" }
);

const Practice = mongoose.model("Practice", practiceSchema);

module.exports = { Practice };
