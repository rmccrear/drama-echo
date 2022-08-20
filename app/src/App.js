import React from "react";

import Button from "react-bootstrap/Button";

import logo from "./logo.svg";

import "./App.scss";

import DialogListing from "./DialogListing";
import withAuth from "./withAuth";
const DialogListingWithAuth = withAuth(DialogListing);

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <Button variant="info"> OK </Button>
        </header>
        <section>
          <DialogListingWithAuth />
        </section>
      </div>
    );
  }
}

export default App;
