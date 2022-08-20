import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import Button from "react-bootstrap/Button";

import logo from "./logo.svg";

import "./App.scss";

import TopNav from "./TopNav";
import Home from "./routes/home";

import DialogListing from "./DialogListing";
import withAuth from "./withAuth";

const DialogListingWithAuth = withAuth(DialogListing);
const TopNavWithAuth = withAuth(TopNav);

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <TopNavWithAuth />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="dialogs" element={<DialogListingWithAuth />} />
        </Routes>
      </div>
    );
  }
}

export default App;
