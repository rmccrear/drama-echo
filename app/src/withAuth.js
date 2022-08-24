import React from "react";

import { fetchUser } from "./models/user";

import { useAuth0 } from "@auth0/auth0-react";

import { setupEchoDialogAuth } from "./models/api";

const withAuthDev = (Component) => {
  return (props) => {
    const user = fetchUser();
    return <Component {...props} user={user} />;
  };
};

const withAuth = (Component) => {
  return (props) => {
    const myAuth0 = useAuth0();
    console.log(myAuth0);
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
      myAuth0;

    console.log("user: ", user);
    const setupAccessToken = () => {
      console.log("trying to get Token");
      return getAccessTokenSilently()
        .then((AUTH_TOKEN) => {
          //getIdTokenClaims().then((ID_TOKEN)=>{
          // const TOKEN = ID_TOKEN__raw;
          const TOKEN = AUTH_TOKEN;
          console.log(TOKEN);
          setupEchoDialogAuth({ token: TOKEN });
        })
        .catch((e) => {
          console.log(e);
          return e;
        });
    };

    const myUser = user ? { ...user, _id: user.sub } : {};
    return isLoading ? (
      ""
    ) : (
      <Component
        {...props}
        user={myUser}
        setupAccessToken={setupAccessToken}
        isAuthenticated={isAuthenticated}
      />
    );
  };
};

export default withAuth;
