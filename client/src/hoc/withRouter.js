import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function withRouter(Component) {
  return function WithRouter(props) {
    const location = useLocation();
    const navigate = useNavigate();
    return <Component {...props} location={location} navigate={navigate} />;
  };
}

