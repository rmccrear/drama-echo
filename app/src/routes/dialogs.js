import React from "react";

import DialogListing from "../components/DialogListing";
import withAuth from "../withAuth";

const DialogListingWithAuth = withAuth(DialogListing);

class DialogsRoute extends React.Component {
  render() {
    return (
      <div className="container">
        <DialogListingWithAuth />
      </div>
    );
  }
}

export default DialogsRoute;
