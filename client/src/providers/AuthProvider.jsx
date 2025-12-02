import React from "react";
import * as api from "../lib/apiClient";

export const AuthContext = React.createContext(null);

export class AuthProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true,
    };
  }

  componentDidMount() {
    this.init();
  }

  init = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      this.setState({ loading: false });
      return;
    }
    try {
      const data = await api.getMe();
      this.setState({ user: data.user || data, loading: false });
    } catch (err) {
      console.warn("Auth init failed:", err);
      localStorage.removeItem("token");
      this.setState({ user: null, loading: false });
    }
  };

  register = async ({ name, email, password }) => {
    const res = await api.register({ name, email, password });
    if (res?.token) {
      localStorage.setItem("token", res.token);
      const me = await api.getMe();
      this.setState({ user: me.user || me });
    }
    return res;
  };

  login = async ({ email, password }) => {
    const res = await api.login({ email, password });
    if (res?.token) {
      localStorage.setItem("token", res.token);
      const me = await api.getMe();
      this.setState({ user: me.user || me });
    }
    return res;
  };

  logout = () => {
    localStorage.removeItem("token");
    this.setState({ user: null });
  };

  render() {
    const { user, loading } = this.state;
    const value = {
      user,
      setUser: (user) => this.setState({ user }),
      loading,
      login: this.login,
      register: this.register,
      logout: this.logout,
    };
    return <AuthContext.Provider value={value}>{this.props.children}</AuthContext.Provider>;
  }
}

