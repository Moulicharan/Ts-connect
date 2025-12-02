import React from "react";
import { Navigate } from "react-router-dom";
import { withAuth } from "../../hoc/withAuth";

class ProtectedRoute extends React.Component {
  render() {
    const { auth, children } = this.props;
    const { user, loading } = auth;

    if (loading) {
      return null;
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return children;
  }
}

export default withAuth(ProtectedRoute);

