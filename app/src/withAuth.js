import React from "react";

import { fetchUser } from "./models/user";

const withAuth = (Comp) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { user: null };
    }
    async componentDidMount() {
      const user = await fetchUser();
      this.setState({ user });
    }
    render() {
      const props = { ...this.props, user: this.state.user };
      return this.state.user ? <Comp {...props} /> : "";
    }
  };
};

export default withAuth;
