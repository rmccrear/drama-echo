import React from "react";

import { fetchUser } from "./models/user";

import { useAuth0 } from "@auth0/auth0-react";

const withAuthDev = (Component) => {
  return (props) => {
    const user = fetchUser();
    return <Component {...props} user={user} />;
  };
};

const withAuth = (Component) => {
  return (props) => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    console.log("user: ", user);
    return !isAuthenticated || isLoading ? (
      ""
    ) : (
      <Component {...props} user={{ ...user, _id: user.sub }} />
    );
  };
};

export default withAuthDev;
