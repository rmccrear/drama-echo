import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import cloudinary from "cloudinary-core";
import withAuth from "../withAuth";
import { getUploadSig } from "../models/dialogs";

const cl = new cloudinary.Cloudinary({
  cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  secure: true,
});

function uploadFile(file, signData, publicId) {
  const formData = new FormData();
  const url =
    "https://api.cloudinary.com/v1_1/" + signData.cloudname + "/auto/upload";
  formData.append("file", file);
  formData.append("api_key", signData.apikey);
  formData.append("timestamp", signData.timestamp);
  formData.append("signature", signData.signature);
  //formData.append("eager", "c_pad,h_300,w_400|c_crop,h_200,w_260");
  formData.append("folder", "signed_upload_demo_form");
  if (publicId) formData.append("public_id", publicId);
  return fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((e) => {
      console.log(e);
    });
}

class CloudinaryUploader extends React.Component {
  constructor(props) {
    super(props);
    //this.sign();
    this.sign = this.sign.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  async sign() {
    await this.props.setupAccessToken();
    const publicId = this.props.publicId;
    const sig = await getUploadSig(publicId);
    return sig;
  }
  async handleChange(e) {
    e.preventDefault();
    const sig = await this.sign();
    const publicId = this.props.publicId;
    if (e.target.files.length === 1) {
      const file = e.target.files[0];
      const uploadedFile = await uploadFile(file, sig, publicId);
      console.log(uploadedFile);
      this.props.handleUploadedFile(uploadedFile);
    }
  }
  render() {
    return (
      <div>
        Upload
        <Form.Group>
          <Form.Label>"Select File:"</Form.Label>
          <Form.Control
            onChange={this.handleChange}
            type="file"
            accept="audio/*,video/*"
          ></Form.Control>
        </Form.Group>
      </div>
    );
  }
}

function publicNameGen(dialog, line) {
  return `${dialog._id}--${line._id}`;
}
export { publicNameGen };

export default withAuth(CloudinaryUploader);
