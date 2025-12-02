import React from "react";
import { withRouter } from "../../../hoc/withRouter";
import { withAuth } from "../../../hoc/withAuth";
import "../styles/AuthPage.css";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      err: null,
    };
  }

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  submit = async (e) => {
    e.preventDefault();
    this.setState({ err: null });
    try {
      await this.props.auth.login({ email: this.state.email, password: this.state.password });
      this.props.navigate("/");
    } catch (error) {
      this.setState({ err: error.message || "Login failed" });
    }
  };

  render() {
    return (
      <div className="auth-page">
        <h2>Login</h2>
        <form onSubmit={this.submit} className="auth-form">
          <div className="auth-form__field">
            <input
              type="email"
              placeholder="email"
              value={this.state.email}
              onChange={this.handleEmailChange}
              required
            />
          </div>
          <div className="auth-form__field">
            <input
              type="password"
              placeholder="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
              required
            />
          </div>
          <button type="submit">Login</button>
          {this.state.err && <div className="auth-form__error">{this.state.err}</div>}
        </form>
      </div>
    );
  }
}

export default withRouter(withAuth(Login));

