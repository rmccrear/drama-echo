const express = require("express");

const dialogRoutes = express.Router();

const {
  create,
  read,
  update,
  del,
  index,
  dialogFeed,
} = require("./controllers/dialog-controllers");

const lineRoutes = require("./controllers/dialog-line-controllers");

const practiceRoutes = require("./controllers/practice-controllers");

// const dbo = require("../db/conn");

const { jwtCheck } = require("../my-auth");

dialogRoutes.use(jwtCheck);

/*
dialogRoutes.route("/api/v1/dialogs").get(async (req, res) => {
  console.log(req.auth)
  const {sub} = req.auth;
  const db = dbo.getDb();
  try {
    const cursor = await db.collection("dialogs").find({user_sub: sub}).limit(20);
    const dialogs = await cursor.toArray();
    res.json(dialogs);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Error fetching dialogs" });
  }
});
*/

dialogRoutes.route("/api/v1/dialogs").get(index);
dialogRoutes.route("/api/v1/dialogs").post(create);
dialogRoutes.route("/api/v1/dialogs/:id").get(read);
dialogRoutes.route("/api/v1/dialogs/:id").put(update);
dialogRoutes.route("/api/v1/dialogs/:id").delete(del);

dialogRoutes
  .route("/api/v1/dialogs/:dialog_id/lines/new")
  .post(lineRoutes.create);
dialogRoutes
  .route("/api/v1/dialogs/:dialog_id/lines/:line_id")
  .put(lineRoutes.update);
dialogRoutes
  .route("/api/v1/dialogs/:dialog_id/lines/:line_id")
  .delete(lineRoutes.del);

const { sign } = require("./controllers/cloudinary-controller");
dialogRoutes.route("/api/v1/signuploadform").get(sign);
dialogRoutes.route("/api/v1/signuploadform/:public_id").get(sign);

// use the dialog_id and the user_sub to find the practice document
dialogRoutes.route("/api/v1/practice").get(practiceRoutes.index);
dialogRoutes
  .route("/api/v1/practice/:dialog_id")
  .post(practiceRoutes.findOrCreate);
dialogRoutes.route("/api/v1/practice/:dialog_id").get(practiceRoutes.read);
dialogRoutes.route("/api/v1/practice/:practice_id").put(practiceRoutes.update);
dialogRoutes.route("/api/v1/practice/:practice_id").delete(practiceRoutes.del);
dialogRoutes
  .route("/api/v1/practice/:practice_id/:echo_id")
  .put(practiceRoutes.updateEcho);

dialogRoutes.route("/api/v1/dialog-feed").get(dialogFeed);
/*
dialogRoutes
  .route("/api/v1/practice/:dialog_id/echo/new")
  .post(practiceRoutes.createEcho);
dialogRoutes
  .route("/api/v1/practice/:dialog_id/echo/:echo_id")
  .post(practiceRoutes.updateEcho);
dialogRoutes
  .route("/api/v1/practice/:dialog_id/echo/:echo_id")
  .delete(practiceRoutes.deleteEcho);
  */

module.exports = dialogRoutes;
