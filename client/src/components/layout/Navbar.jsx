import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "../../hoc/withRouter";
import { withAuth } from "../../hoc/withAuth";
import "../../index.css";

class Navbar extends React.Component {
  isActive = (path) => {
    return this.props.location.pathname === path ? "active" : "";
  };

  onClickLogout = () => {
    this.props.auth.logout();
    this.props.navigate("/login");
  };

  render() {
    const { auth } = this.props;
    const { user } = auth;

    return (
      <nav>
        <div className="brand">
          <div className="logo">Ts</div>
          <h1>Time square Connect</h1>
        </div>

        <div className="links">
          <Link className={this.isActive("/")} to="/">Home</Link>
          <Link className={this.isActive("/feed")} to="/feed">Feed</Link>
          <Link className={this.isActive("/users")} to="/users">Users</Link>
          <Link className={this.isActive("/requests")} to="/requests">Requests</Link>
          {user ? (
            <button type="button" className="logout-btn" onClick={this.onClickLogout}>
              Logout
            </button>
          ) : (
            <>
              <Link className={this.isActive("/login")} to="/login">Login</Link>
              <Link className={this.isActive("/register")} to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    );
  }
}

export default withRouter(withAuth(Navbar));

