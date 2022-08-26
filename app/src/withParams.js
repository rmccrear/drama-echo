import React from "react";
import { useParams, useNavigate } from "react-router-dom";

function withParams(Component) {
  return (props) => (
    <Component {...props} params={useParams()} navigate={useNavigate()} />
  );
}

export default withParams;
