const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
require("../../cloudinary-config");
const { Dialog } = require("../../db/models/dialogs");
const apiSecret = cloudinary.config().api_secret;

const remoteFolder = process.env.CLOUDINARY_REMOTE_LINES_OF_DIALOG_FOLDER;

const signuploadform = (public_id) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const requestedParams = {
    timestamp: timestamp,
    // eager: 'c_pad,h_300,w_400|c_crop,h_200,w_260',
    folder: remoteFolder,
  };
  if (public_id) requestedParams.public_id = public_id;
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
  const { public_id } = req.params;
  const { sub } = req.auth; // user_id
  // verify public_id format is dialog_id--line_id
  if (public_id) {
    try {
      const isValid = await validatePublicId(sub, public_id);
      if (!isValid) return res.status(400).send({ error: "Invalid public_id" });
    } catch (e) {
      return res.status(400).send({ error: e });
    }
  }

  try {
    const sig = signuploadform(public_id);
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

async function validatePublicId(user_sub, public_id) {
  [dialog_id, line_id] = public_id.split("--");
  if (
    mongoose.Types.ObjectId.isValid(dialog_id) &&
    mongoose.Types.ObjectId.isValid(line_id)
  ) {
    dialog = await Dialog.findOne({ user_sub, _id: dialog_id });
    if (dialog) {
      return true;
    }
  }
  return false;
}

function mediaPublicIdGen(dialog_id, line_id) {
  return `${dialog_id}--${line_id}`;
}

function deleteMedia(dialog_id, line_id) {
  const public_id = `${remoteFolder}/${mediaPublicIdGen(dialog_id, line_id)}`;
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

module.exports = { sign, deleteMedia };
