import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
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
    <div className="container w-75">
      <Card>
        <Card.Header>Welcome to Dialgo Echo</Card.Header>
        <Card.Body>
          <Button as={Link} to="/dialogs" className="m-3 float-start">
            I am a teacher.
          </Button>
          <Button as={Link} to="/echoes" className="m-3 float-end">
            I am a student.
          </Button>
        </Card.Body>
      </Card>
    </div>
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
          <GetStartedButton className="m-3" />
        </header>
      </React.Fragment>
    );
  }
}

export default HomeRoute;
