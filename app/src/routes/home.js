import React from "react";
import Button from "react-bootstrap/Button";
import "./home.scss";
// import withAuth from "../withAuth";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

import { wakeUpServer } from "../models/api";

const GetStartedButton = (props) => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  return !isAuthenticated ? (
    <Button onClick={() => loginWithRedirect()}>Get Started</Button>
  ) : (
    <Button as={Link} to="/dialogs">
      My Dialogs
    </Button>
  );
};

class HomeRoute extends React.Component {
  constructor(props) {
    super(props);
    wakeUpServer();
  }
  render() {
    return (
      <React.Fragment>
        <header>
          <h1> Drama Echo </h1>
          <p> Practice pronunciation with friends or alone. </p>
          <p>
            <GetStartedButton />
          </p>
        </header>
      </React.Fragment>
    );
  }
}

export default HomeRoute;
