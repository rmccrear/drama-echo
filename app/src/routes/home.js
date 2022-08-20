import React from "react";
import Button from "react-bootstrap/Button";
import "./home.scss";
import withAuth from "../withAuth";

class HomeRoute extends React.Component {
  render() {
    return (
      <React.Fragment>
        <header>
          <h1> Drama Echo </h1>
          <p> Practice pronunciation with friends or alone. </p>
          <p>
            <Button> Get Started </Button>
          </p>
        </header>
      </React.Fragment>
    );
  }
}

export default HomeRoute;
