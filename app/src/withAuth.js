import React from "react";

import { useAuth0 } from "@auth0/auth0-react";

import { setupEchoDialogAuth } from "./models/api";

import Loading from "./components/Loading";
/*
const withAuthDev = (Component) => {
  return (props) => {
    const user = fetchUser();
    return <Component {...props} user={user} />;
  };
};
*/

//let AUTH_TOKEN_CACHE;
//let AUTH_TOKEN_CACHE_EXP;

const withAuth = (Component) => {
  return (props) => {
    const {
      user,
      isAuthenticated,
      isLoading,
      getIdTokenClaims, // for LOGIN AUTH
      // getAccessTokenSilently, // for API AUTH
      loginWithRedirect,
    } = useAuth0();

    /* */
    // for AUTH TOKEN
    const setupAccessToken = () => {
      //if (AUTH_TOKEN_CACHE && Date.now() < AUTH_TOKEN_CACHE_EXP) {
      //  return setupEchoDialogAuth({ token: AUTH_TOKEN_CACHE });
      //}
      return getIdTokenClaims()
        .then((ID_TOKEN) => {
          const AUTH_TOKEN = ID_TOKEN.__raw;
          const TOKEN = AUTH_TOKEN;
          //AUTH_TOKEN_CACHE = TOKEN;
          //AUTH_TOKEN_CACHE_EXP = Date.now() + 80000;
          setupEchoDialogAuth({ token: TOKEN });
        })
        .catch(() => {
          loginWithRedirect({
            appState: { returnTo: window.location.pathname },
          });
        });
    };
    /**/
    /*
    // for API TOKEN
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
            loginWithRedirect({
              appState: { returnTo: window.location.pathname },
            });
          }
          return e;
        });
    };
    */

    const myUser = user ? { ...user, _id: user.sub } : {};
    return isLoading ? (
      <Loading />
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
