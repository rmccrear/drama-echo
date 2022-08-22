import React from "react";
import Nav from "react-bootstrap/Nav";
import { useAuth0 } from "@auth0/auth0-react";

const NavLogin = (props) => {
  const { loginWithRedirect } = useAuth0();
  return <Nav.Link onClick={() => loginWithRedirect()}>Log In</Nav.Link>;
};
const NavLogout = (props) => {
  const { logout } = useAuth0();
  return (
    <Nav.Link onClick={() => logout({ returnTo: "/" })}>
      Log Out ({props.user.nickname}){" "}
    </Nav.Link>
  );
};

const AuthNavBar = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return "";
  }
  return isAuthenticated ? <NavLogout user={user} /> : <NavLogin />;
};

export default AuthNavBar;
