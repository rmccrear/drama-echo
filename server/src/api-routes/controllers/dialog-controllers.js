const {
  getDialog,
  getDialogsForUser,
  updateDialog,
  Dialog,
} = require("../../db/models/dialogs");

const { deleteMedia } = require("./cloudinary-controller");

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
    const dialogParams = {
      title: d.title,
      characters: d.characters,
      status: d.status,
    };
    console.log(dialogParams);
    const dialog_id = id;
    const dialog = await updateDialog(sub, dialog_id, dialogParams);
    res.send(dialog);
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
    const dialog = await Dialog.findOneAndDelete({ user_sub: sub, _id: id });
    const promises = dialog.lines.map((line) => deleteMedia(id, line._id));
    await Promise.all(promises);
    res.send({ message: "Deleted dialog", id });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: "Error fetching dialog " + id });
  }
}

// get dialogs for user to try
async function dialogFeed(req, res) {
  // TODO: randomize or personalize
  // TODO: only grab dialogs marked "public" and "published"
  try {
    //Get the dialog feed:
    const dialogs = await Dialog.find({}).limit(20).exec();
    // scrub out user_sub data
    dialogs.forEach((d) => (d.user_sub = ""));
    res.send(dialogs);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: "Error fetching dialog feed " });
  }
}

module.exports = { create, update, read, del, index, dialogFeed };
