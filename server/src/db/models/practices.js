const mongoose = require("mongoose");

const echoSchema = new mongoose.Schema({
  characterIdx: Number, // index from characters in Dialog
  audioUrl: String,
});

const practiceSchema = new mongoose.Schema({
  user_sub: String,
  dialog_id: String,
  characterIdx: Number,
  echoes: [echoSchema],
});

const Practice = mongoose.model("Practice", practiceSchema);

module.exports = { Practice };
