import React from "react";

import Button from "react-bootstrap/Button";

import logo from "./logo.svg";

import "./App.scss";

import DialogListing from "./DialogListing";

import { fetchUser } from "./models/user";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null };
  }
  componentDidMount() {
    const user = fetchUser();
    this.setState({ ...this.state, user });
  }
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
          {this.state.user ? <DialogListing user={this.state.user} /> : ""}
        </section>
      </div>
    );
  }
}

export default App;
