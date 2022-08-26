const express = require("express");

const dialogRoutes = express.Router();

const {
  create,
  read,
  update,
  del,
  index,
} = require("./controllers/dialog-controllers");

const dbo = require("../db/conn");

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

module.exports = dialogRoutes;
