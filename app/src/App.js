import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import "./App.scss";

import TopNav from "./components/TopNav";

import DialogCreate from "./components/DialogCreate";
import DialogView from "./components/DialogView";
import DialogUpdate from "./components/DialogUpdate";

import Home from "./routes/home";
import DialogRoute from "./routes/dialogs";
import MyProfileRoute from "./routes/my-profile";

//import withAuth from "./withAuth";
//const TopNavWithAuth = withAuth(TopNav);

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <TopNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="dialogs" element={<DialogRoute />} />
          <Route path="dialogs/new" element={<DialogCreate />} />
          <Route path="dialogs/:dialog_id/edit" element={<DialogUpdate />} />
          <Route path="dialogs/:dialog_id" element={<DialogView />} />
          <Route path="my-profile" element={<MyProfileRoute />} />
        </Routes>
      </div>
    );
  }
}

export default App;
