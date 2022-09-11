const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
require("../../cloudinary-config");
const { Dialog } = require("../../db/models/dialogs");
const { Practice } = require("../../db/models/practices");
const apiSecret = cloudinary.config().api_secret;

const remoteLinesOfDialogFolder =
  process.env.CLOUDINARY_REMOTE_LINES_OF_DIALOG_FOLDER;
const remoteDialogdemosFolder =
  process.env.CLOUDINARY_REMOTE_DIALOG_DEMOS_FOLDER;

const signuploadform = (public_id, folder) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const requestedParams = {
    timestamp: timestamp,
    // eager: 'c_pad,h_300,w_400|c_crop,h_200,w_260',
    public_id: public_id,
    folder: folder,
  };
  const signature = cloudinary.utils.api_sign_request(
    requestedParams,
    apiSecret
  );

  return { timestamp, signature };
};

const cloudName = cloudinary.config().cloud_name;
const apiKey = cloudinary.config().api_key;

// using this API should require authentication
async function sign(req, res) {
  /* uploadType = "echodialog_lines | echodialog_echoes | echodialog_dialogdemos" */
  const { public_id, upload_type } = req.params;

  const { sub } = req.auth; // user_id
  try {
    const isValid = await validatePublicId(sub, public_id, upload_type);
    if (!isValid) return res.status(400).send({ error: "Invalid public_id" });
  } catch (e) {
    return res.status(400).send({ error: e });
  }

  try {
    const sig = signuploadform(public_id, upload_type);
    const resObj = {
      signature: sig.signature,
      timestamp: sig.timestamp,
      cloudname: cloudName,
      apikey: apiKey,
    };
    if (public_id) resObj.public_id = public_id;
    res.json(resObj);
  } catch (e) {
    res.status(400).send({ error: e });
  }
}
/*
  for upload_type === "echodialogs_lines"
    public_id === echodialogs_lines/{dialog_id}--{line_id} (where dialog_id is owned by current user)
  for upload_type === "echodialogs_demos"
    public_id === echodialogs_demos/{dialog_id} (where dialog_id is owned by current user)
  for upload_type === "echodialogs__echo"
    public_id === echodialogs_echoes/{practice_id}--echo_id (where practice_id is owned by current user)
*/
async function validatePublicId(user_sub, public_id, upload_type) {
  if (upload_type === "echodialog_lines") {
    const sections = public_id.split("--");
    [dialog_id, line_id] = sections;
    if (
      mongoose.Types.ObjectId.isValid(dialog_id) &&
      mongoose.Types.ObjectId.isValid(line_id) &&
      sections.length === 2
    ) {
      dialog = await Dialog.findOne({ user_sub, _id: dialog_id });
      if (dialog) {
        return true;
      }
    }
    return false;
  } else if (upload_type === "echodialog_dialogdemos") {
    const dialog_id = public_id;
    if (mongoose.Types.ObjectId.isValid(dialog_id)) {
      dialog = await Dialog.findOne({ user_sub, _id: dialog_id });
      if (dialog) {
        return true;
      } else {
        console.log("Error in signing echodialog_dialogdemos: ", dialog_id);
      }
    }
  } else if (upload_type === "echodialog_echoes") {
    const sections = public_id.split("--");
    [practice_id, echo_id] = sections;
    if (
      mongoose.Types.ObjectId.isValid(practice_id) &&
      mongoose.Types.ObjectId.isValid(echo_id) &&
      sections.length === 2
    ) {
      practice = await Practice.findOne({ user_sub, _id: practice_id });
      if (practice) {
        return true;
      } else {
        console.log(
          "Error in signing echodialog_echoes: ",
          practice_id,
          echo_id
        );
      }
    }
  }
  return false;
}

function mediaPublicIdGen(dialog_id, line_id) {
  return `${dialog_id}--${line_id}`;
}

// delete media for line
function deleteMedia(dialog_id, line_id) {
  const public_id = `${remoteLinesOfDialogFolder}/${mediaPublicIdGen(
    dialog_id,
    line_id
  )}`;
  return cloudinary.uploader
    .destroy(public_id, {
      resource_type: "video",
      invalidate: true,
      type: "upload",
    })
    .then((res) => {
      return res;
    });
}

module.exports = {
  sign, // exported
  deleteMedia, // exported
  validatePublicId, // for tests
};
