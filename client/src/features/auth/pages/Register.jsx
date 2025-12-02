import React from "react";
import { withRouter } from "../../../hoc/withRouter";
import { withAuth } from "../../../hoc/withAuth";
import "../styles/AuthPage.css";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      err: null,
    };
  }

  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  };

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
      await this.props.auth.register({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
      });
      this.props.navigate("/");
    } catch (error) {
      this.setState({ err: error.message || "Registration failed" });
    }
  };

  render() {
    return (
      <div className="auth-page">
        <h2>Register</h2>
        <form onSubmit={this.submit} className="auth-form">
          <div className="auth-form__field">
            <input placeholder="Full name" value={this.state.name} onChange={this.handleNameChange} required />
          </div>
          <div className="auth-form__field">
            <input
              type="email"
              placeholder="college email (must be @student.nitw.ac.in)"
              value={this.state.email}
              onChange={this.handleEmailChange}
              required
            />
          </div>
          <div className="auth-form__field">
            <input
              type="password"
              placeholder="password (6+ chars)"
              value={this.state.password}
              onChange={this.handlePasswordChange}
              required
            />
          </div>
          <button type="submit">Register</button>
          {this.state.err && <div className="auth-form__error">{this.state.err}</div>}
        </form>
      </div>
    );
  }
}

export default withRouter(withAuth(Register));

