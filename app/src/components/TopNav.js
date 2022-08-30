import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import AuthNavBar from "./AuthNavBar";

import { Link } from "react-router-dom";

class TopNav extends React.Component {
  render() {
    return (
      <Navbar>
        <Container>
          <Navbar.Brand as={Link} to="/">
            Drama Echo
          </Navbar.Brand>
          <Navbar.Collapse>
            <Nav>
              <Nav.Link as={Link} to="dialogs">
                My Dialogs
              </Nav.Link>
              <Nav.Link as={Link} to="echoes">
                My Echos
              </Nav.Link>
              <AuthNavBar />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default TopNav;
