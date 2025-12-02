import React from "react";
import { AuthContext } from "../providers/AuthProvider";

export function withAuth(Component) {
  return class WithAuth extends React.Component {
    static contextType = AuthContext;

    render() {
      const auth = this.context;
      if (!auth) {
        throw new Error("withAuth must be used within AuthProvider");
      }
      return <Component {...this.props} auth={auth} />;
    }
  };
}

