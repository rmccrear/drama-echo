const mongoose = require("mongoose");

const lineSchema = new mongoose.Schema({
  characterIdx: Number, // index from characters in Dialog
  content: String,
  audioUrl: String,
});

const dialogSchema = new mongoose.Schema({
  title: String,
  characters: [String],
  user_sub: String,
  lines: [lineSchema],
});

const Dialog = mongoose.model("Dialog", dialogSchema);

async function getDialogsForUser(user_sub, len, offset) {
  //const db = dbo.getDb();
  // TODO: add pagination
  len = len || 20;
  // offest = offset || 0;
  // const dialogs = await Dialog.find({user_sub: user_sub}).sort({title: 1}).skip(offset).limit(len).exec();
  const dialogs = await Dialog.find({ user_sub: user_sub }).limit(len).exec();
  return dialogs;
}

async function getDialog(user_sub, dialog_id) {
  const dialog = await Dialog.findOne({
    _id: dialog_id,
    user_sub: user_sub,
  }).exec();
  return dialog;
}

async function updateDialog(user_sub, dialog_id, dialog) {
  return await Dialog.updateOne({ _id: dialog_id, user_sub }, { $set: dialog });
}

module.exports = {
  getDialogsForUser,
  getDialog,
  updateDialog,
  Dialog,
};
