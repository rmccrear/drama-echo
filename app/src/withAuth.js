import React from "react";

import { useAuth0 } from "@auth0/auth0-react";

import { setupEchoDialogAuth } from "./models/api";

/*
const withAuthDev = (Component) => {
  return (props) => {
    const user = fetchUser();
    return <Component {...props} user={user} />;
  };
};
*/

let AUTH_TOKEN_CACHE;
let AUTH_TOKEN_CACHE_EXP;

const withAuth = (Component) => {
  return (props) => {
    const myAuth0 = useAuth0();
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
      myAuth0;

    const setupAccessToken = () => {
      if (AUTH_TOKEN_CACHE && Date.now() < AUTH_TOKEN_CACHE_EXP) {
        return Promise.resolve(AUTH_TOKEN_CACHE);
      }
      return getAccessTokenSilently()
        .then((AUTH_TOKEN) => {
          //getIdTokenClaims().then((ID_TOKEN)=>{
          // const TOKEN = ID_TOKEN__raw;
          const TOKEN = AUTH_TOKEN;
          AUTH_TOKEN_CACHE = TOKEN;
          AUTH_TOKEN_CACHE_EXP = Date.now() + 80000;
          setupEchoDialogAuth({ token: TOKEN });
        })
        .catch((e) => {
          console.log(e);
          if (e.message === "Login required") {
            myAuth0.loginWithRedirect();
          }
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
