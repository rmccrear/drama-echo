import React from "react";
import { Routes, Route } from "react-router-dom";

import "./App.scss";

import TopNav from "./components/TopNav";

import DialogCreate from "./components/DialogCreate";
import DialogView from "./components/DialogView";
import DialogUpdate from "./components/DialogUpdate";

import Home from "./routes/home";
import DialogRoute from "./routes/dialogs";
import MyProfileRoute from "./routes/my-profile";

import EchoHome from "./components/echo-components/EchoHome";
import EchoDialog from "./components/echo-components/EchoDialog";

//import withAuth from "./withAuth";
//const TopNavWithAuth = withAuth(TopNav);
import withProtect from "./withProtect";
const ProtectedDialogRoute = withProtect(DialogRoute);
const ProtectedEchoDialog = withProtect(EchoDialog);
const ProtectedEchoHome = withProtect(EchoHome);
const ProtectedDialogCreate = withProtect(DialogCreate);
const ProtectedDialogUpdate = withProtect(DialogUpdate);
const ProtectedMyProfileRoute = withProtect(MyProfileRoute);
const ProtectedDialogView = withProtect(DialogView);

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <TopNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="dialogs" element={<ProtectedDialogRoute />} />
          <Route path="dialogs/new" element={<ProtectedDialogCreate />} />
          <Route
            path="dialogs/:dialog_id/edit"
            element={<ProtectedDialogUpdate />}
          />
          <Route path="dialogs/:dialog_id" element={<ProtectedDialogView />} />
          <Route path="echoes" element={<ProtectedEchoHome />} />
          <Route path="echo" element={<ProtectedEchoHome />} />
          <Route path="echo/:dialog_id" element={<ProtectedEchoDialog />} />
          <Route path="my-profile" element={<ProtectedMyProfileRoute />} />
        </Routes>
      </div>
    );
  }
}

export default App;
