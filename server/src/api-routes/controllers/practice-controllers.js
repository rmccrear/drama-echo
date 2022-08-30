const { Practice } = require("../../db/models/practices");
const { Dialog } = require("../../db/models/dialogs");

const { deleteMedia } = require("./cloudinary-controller");

async function index(req, res) {
  const user_sub = req.auth.sub; // user_id
  const len = 20;
  try {
    const practices = await Practice.find({ user_sub }).limit(len).exec();
    res.send(practices);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: "Error fetching practices" });
  }
}

/*
   Create with characterIdx
*/
// we will try to keep this unique
async function findOrCreate(req, res) {
  const { dialog_id } = req.params; // dialog_id
  const user_sub = req.auth.sub; // user_id
  const cIdx = req.body.characterIdx;
  const characterIdx = !Number.isNaN(parseInt(cIdx, 10)) //if no characaterIdx, we will ask for it later from the user.
    ? parseInt(cIdx, 10)
    : -1;
  try {
    let practice = await Practice.findOne({ user_sub, dialog_id });
    if (!practice) {
      const dialog = await Dialog.findOne({ dialog_id });
      if (!dialog)
        return res
          .status(404)
          .send({ error: "Can't find dialog: " + dialog_id });
      dialog.user_sub = ""; // Don't leak other user's user_sub.
      const lines = dialog.lines.map((line) => line.toJSON());
      const echoes = lines.map((line) => {
        return { line_id: line._id };
      });
      const practiceParams = {
        user_sub,
        dialog_id,
        characterIdx: characterIdx,
        echoes: echoes,
        dialog: dialog,
      };
      console.log(practiceParams);
      practice = await Practice.create(practiceParams);
    }
    res.send(practice);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e });
  }
}

async function read(req, res) {
  const { dialog_id } = req.params; // dialog_id
  const user_sub = req.auth.sub; // user_id
  try {
    const practice = await Practice.findOne({ user_sub, dialog_id });
    if (!practice) res.status(404).send({ error: "Not found" });
    else res.send(practice);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e });
  }
}

/*
  This one uses practice_id to find the practice doc, since we are sure to have it.
  Also, we need the practice_id to stay static on sub-document update.
  Update changes the characterIdx, and deletes the old echoes
*/
async function update(req, res) {
  const { practice_id } = req.params; // dialog_id
  const user_sub = req.auth.sub; // user_id
  const { characterIdx } = req.body;
  try {
    const practice = await Practice.findOneAndUpdate(
      { user_sub, _id: practice_id },
      { $set: { _id: practice_id, characterIdx } },
      { new: false } // need old practice to do deletes
    );
    // TODO: delete old echoes if we change characters
    // const p = practice.echoes.map((echo)=>deleteEcho(practice_id, echo._id));
    const p2 = Practice.findById(practice_id);
    // await Promise.all(p)
    const practiceUpdated = await p2;
    res.send(await practiceUpdated);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e });
  }
}

async function del(req, res) {
  const { practice_id } = req.params; // dialog_id
  const user_sub = req.auth.sub; // user_id
  try {
    const practice = await Practice.findOneAndDelete({
      user_sub,
      _id: practice_id,
    });
    // TODO: delete echo resources
    res.send(practice);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e });
  }
}

async function updateEcho(req, res) {
  const { practice_id, echo_id } = req.params; // dialog_id
  const user_sub = req.auth.sub; // user_id
  const { echoAudioUrl } = req.body;
  try {
    const echoParams = {
      _id: echo_id,
      echoAudioUrl,
    };
    const practice = await Practice.findOneAndUpdate(
      { user_sub, _id: practice_id, "echoes._id": echo_id },
      { $set: { "echoes.$": echoParams } },
      { new: true }
    );
    res.send(practice);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e });
  }
}

// module.exports = { readOrCreate, updateEcho, deleteEcho, index };
module.exports = { read, findOrCreate, update, del, index, updateEcho };
