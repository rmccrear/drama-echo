const { Dialog } = require("../../db/models/dialogs");
const { deleteMedia } = require("./cloudinary-controller");

async function create(req, res) {
  const { dialog_id } = req.params; // dialog_id
  const { sub } = req.auth; // user_id

  try {
    const lineParams = req.body;

    const dialog = await Dialog.findOneAndUpdate(
      { user_sub: sub, _id: dialog_id },
      { $push: { lines: lineParams } },
      { new: true }
    );
    const line = dialog.lines.pop();
    res.send(line);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: "Error creating line of dialog" });
  }
}

async function update(req, res) {
  const { dialog_id, line_id } = req.params; // dialog_id
  const { sub } = req.auth; // user_id

  try {
    const lineParams = req.body;

    const dialog = await Dialog.findOneAndUpdate(
      { user_sub: sub, _id: dialog_id, "lines._id": line_id },
      { $set: { "lines.$": lineParams } },
      { new: true }
    );
    const line = dialog.lines.find((line) => line._id.toString() === line_id);
    res.send(line);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: "Error creating line of dialog" });
  }
}

async function del(req, res) {
  const { dialog_id, line_id } = req.params; // dialog_id
  const { sub } = req.auth; // user_id
  console.log(dialog_id, line_id);
  try {
    const result = await Dialog.findOneAndUpdate(
      { _id: dialog_id, user_sub: sub },
      { $pull: { lines: { _id: line_id } } },
      { new: true }
    );
    const del_resp = deleteMedia(dialog_id, line_id);
    console.log(del_resp);
    res.send(result);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e });
  }
}

module.exports = {
  create,
  update,
  del,
};
