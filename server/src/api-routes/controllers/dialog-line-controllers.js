const { Dialog } = require("../../db/models/dialogs");

async function create(req, res) {
  const { dialog_id } = req.params; // dialog_id
  const { sub } = req.auth; // user_id
  try {
    const d = req.body;
    const lineParams = {
      content: d.content,
      characterIdx: d.characterIdx,
      order: d.order,
    };
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
  console.log(dialog_id, line_id);
  try {
    const d = req.body;
    const lineParams = {
      content: d.content,
      characterIdx: d.characterIdx,
      order: d.order,
    };
    const dialog = await Dialog.findOneAndUpdate(
      { user_sub: sub, _id: dialog_id, "lines._id": line_id },
      { $set: { "lines.$": lineParams } },
      { new: true }
    );
    console.log(dialog);
    const line = dialog.lines.find((line) => line._id.toString() === line_id);
    res.send(line);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: "Error creating line of dialog" });
  }
}

module.exports = {
  create,
  update,
};
