const {ObjectId} = require('mongodb');
const dbo = require("../conn");

async function getDialogsForUser(user_sub, len, offset) {
    const db = dbo.getDb();
    len = len || 20;
    try {
      const cursor = await db.collection("dialogs").find({user_sub: user_sub}).limit(len);
      const dialogs = await cursor.toArray();
      res.json(dialogs);
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: "Error fetching dialogs" });
    }
}

async function getDialog(user_sub, dialog_id) {
    const db = dbo.getDb();
    console.log(user_sub, dialog_id);
    const dialog = await db.collection("dialogs").findOne({_id: new ObjectId(dialog_id), user_sub: user_sub});
    console.log("dialog", dialog);
    return dialog;
}

async function updateDialog(user_sub, dialog){
    await collection("dialogs").update({user_sub, _id: new ObjectId(dialog._id)}, {$set: {...dialog}})
}

module.exports = {
    getDialogsForUser,
    getDialog,
    updateDialog
};