import React, { Fragment } from "react";
import Nav from "react-bootstrap/Nav";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

const logoutUrl = process.env.REACT_APP_AUTH0_LOGOUT_URL;

const NavLogin = (props) => {
  const { loginWithRedirect } = useAuth0();
  return <Nav.Link onClick={() => loginWithRedirect()}>Log In</Nav.Link>;
};
const NavLogout = (props) => {
  const { logout } = useAuth0();
  return (
    <Nav.Link onClick={() => logout({ returnTo: logoutUrl })}>Log Out</Nav.Link>
  );
};

const AuthNavBar = (props) => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return "";
  }
  return isAuthenticated ? (
    <Fragment>
      <NavLogout user={user} />
      <Nav.Link as={Link} to="my-profile">
        ({props.user ? props.user.nickname : ""})
      </Nav.Link>
    </Fragment>
  ) : (
    <NavLogin />
  );
};

export default AuthNavBar;
