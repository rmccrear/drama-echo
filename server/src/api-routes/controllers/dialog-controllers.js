const {
  getDialog,
  getDialogsForUser,
  updateDialog,
  Dialog,
} = require("../../db/models/dialogs");

async function index(req, res) {
  const { sub } = req.auth; // user_id
  try {
    const dialogs = await getDialogsForUser(sub);
    res.send(dialogs);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: "Error fetching dialogs for " + sub });
  }
}

async function create(req, res) {
  const { sub } = req.auth; // user_id
  try {
    const d = req.body;
    const dialogParams = {
      title: d.title,
      characters: d.characters,
      user_sub: sub,
    };
    const dialog = await Dialog.create(dialogParams);
    res.send(dialog);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: "Error creating dialog " + id });
  }
}

async function update(req, res) {
  const { id } = req.params; // dialog_id
  const { sub } = req.auth; // user_id
  try {
    const d = req.body;
    const dialogParams = { title: d.title, characters: d.characters };
    const dialog_id = id;
    await updateDialog(sub, dialog_id, dialogParams);
    res.send({ message: "Update dialog ", id });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: "Error updating dialog " + id });
  }
}

async function read(req, res) {
  const { id } = req.params; // dialog_id
  const { sub } = req.auth; // user_id
  try {
    const dialog = await getDialog(sub, id);
    if (dialog) {
      res.send(dialog);
    } else {
      res.status(404).send({ error: "Dialog not found " + id });
    }
  } catch (e) {
    console.log(e);
    if (e.name === "CastError") {
      res.status(404).send({ error: "Cannot find dialog with bad ID" + id });
    } else {
      res.status(400).send({ error: "Error fetching dialog " + id });
    }
  }
}

async function del(req, res) {
  const { id } = req.params; // dialog_id
  const { sub } = req.auth; // user_id
  try {
    await Dialog.deleteOne({ user_sub: sub, _id: id });
    res.send({ message: "Deleted dialog", id });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: "Error fetching dialog " + id });
  }
}

module.exports = { create, update, read, del, index };
