import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import Loading from "./components/Loading";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };
  const isLoadingAppDate = searchParams.get("code") ? true : false;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
      audience={audience}
    >
      {isLoadingAppDate ? <Loading /> : children}
    </Auth0Provider>
  );
};

export default AuthProvider;
