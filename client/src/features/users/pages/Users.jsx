import React from "react";
import { withAuth } from "../../../hoc/withAuth";
import { fetchUsers, sendRequest } from "../../../lib/apiClient";
import "./Users.css";

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      sendingFor: null,
      messageByUser: {},
    };
    this.PLACEHOLDER = "/mnt/data/828e6649-415b-4991-a505-22e861026bfe.png";
  }

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers = async () => {
    try {
      const res = await fetchUsers();
      this.setState({ users: res.users || [] });
    } catch (err) {
      console.error("Failed loading users", err);
      this.setState({ users: [] });
    }
  };

  handleChange = (id, val) => {
    this.setState((prevState) => ({
      messageByUser: { ...prevState.messageByUser, [id]: val },
    }));
  };

  handleSend = async (toId) => {
    const { auth } = this.props;
    if (!auth.user) return alert("Please login to send a request.");
    const text = (this.state.messageByUser[toId] || "").trim();
    this.setState({ sendingFor: toId });
    try {
      await sendRequest(toId, text);
      alert("Request sent ✅");
      this.setState((prevState) => ({
        messageByUser: { ...prevState.messageByUser, [toId]: "" },
      }));
    } catch (err) {
      console.error(err);
      alert(err?.body?.error || err.message || "Could not send request");
    } finally {
      this.setState({ sendingFor: null });
    }
  };

  render() {
    const { users, sendingFor, messageByUser } = this.state;
    const { auth } = this.props;
    const { user } = auth;

    return (
      <div className="container users-page">
        <div className="page-title">
          <div>
            <h2>All Students</h2>
            <div className="small">Browse peers — send a one-time request to start chatting.</div>
          </div>
        </div>

        <div className="users-list-wrapper">
          {users.length === 0 ? (
            <div className="card">
              <p className="small">No students found yet.</p>
            </div>
          ) : (
            <div className="users-list">
              {users.map((u) => (
                <div key={u._id} className="card list-item user-card">
                  <div className="user-card__profile">
                    <div className="avatar">
                      <img src={u.avatarUrl || this.PLACEHOLDER} alt={u.name} className="user-card__avatar-image" />
                    </div>

                    <div className="user-card__details">
                      <div className="user-card__details-row">
                        <strong className="user-card__name">{u.name}</strong>
                        <span className="user-card__status"></span>
                      </div>
                      <div className="small user-card__email">{u.email}</div>
                      {u.bio && <div className="user-card__bio">{u.bio}</div>}
                    </div>
                  </div>

                  <div className="user-card__actions">
                    <div className="user-card__message-row">
                      <input
                        value={messageByUser[u._id] || ""}
                        onChange={(e) => this.handleChange(u._id, e.target.value)}
                        placeholder="Optional message (hi!)"
                        className="user-card__message-input"
                      />
                    </div>

                    <div className="user-card__buttons">
                      <button
                        onClick={() => this.handleSend(u._id)}
                        disabled={sendingFor === u._id}
                        title={user ? `Send request to ${u.name}` : "Login required"}
                      >
                        {sendingFor === u._id ? "Sending..." : "Send Request"}
                      </button>
                      <a href={`/profile/${u._id}`} className="user-card__view-link">
                        <button className="secondary">View</button>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withAuth(Users);

