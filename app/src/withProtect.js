import React from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import Loading from "./components/Loading";

const withProtect = (Component) => {
  return (props) => {
    const { isAuthenticated, loginWithRedirect } = useAuth0();
    if (!isAuthenticated) {
      const location = useLocation();
      loginWithRedirect({
        appState: { returnTo: location },
      });
    }
    return isAuthenticated ? <Component {...props} /> : <Loading />;
  };
};

export default withProtect;
