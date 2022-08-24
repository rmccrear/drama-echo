import React from "react";
import Button from "react-bootstrap/Button";
import withAuth from "../withAuth";
import { Link } from "react-router-dom";

import { getProfile } from "../models/user";

class MyProfileRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {
    await this.props.setupAccessToken();
    const prof = await getProfile();
    this.setState({ ...this.state, message: prof.message });
  }
  render() {
    return (
      <React.Fragment>
        <header>
          <h1> Your Profile </h1>
          <p>Hello {this.props.user.nickname}</p>
          <p>
            Your status is: <b> {this.state.message} </b>
          </p>

          <Button as={Link} to="/">
            {" "}
            OK{" "}
          </Button>
        </header>
      </React.Fragment>
    );
  }
}

export default withAuth(MyProfileRoute);
