import React from "react";
import { withAuth } from "../../../hoc/withAuth";
import { fetchRequests, acceptRequest, rejectRequest } from "../../../lib/apiClient";
import "./Requests.css";

class Requests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      loading: true,
      actioning: null,
    };
    this.PLACEHOLDER_AVATAR = "/mnt/data/828e6649-415b-4991-a505-22e861026bfe.png";
  }

  componentDidMount() {
    this.load();
  }

  load = async () => {
    this.setState({ loading: true });
    try {
      const res = await fetchRequests();
      this.setState({ requests: res.requests || [] });
    } catch (err) {
      console.error("Could not load requests", err);
      this.setState({ requests: [] });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleAccept = async (id) => {
    this.setState({ actioning: id });
    try {
      await acceptRequest(id);
      alert("Request accepted. You can now chat.");
      await this.load();
    } catch (err) {
      alert(err.message || "Could not accept request");
    } finally {
      this.setState({ actioning: null });
    }
  };

  handleReject = async (id) => {
    this.setState({ actioning: id });
    try {
      await rejectRequest(id);
      alert("Request rejected.");
      await this.load();
    } catch (err) {
      alert(err.message || "Could not reject request");
    } finally {
      this.setState({ actioning: null });
    }
  };

  render() {
    const { requests, loading, actioning } = this.state;
    const { auth } = this.props;
    const { user } = auth;

    if (!user) return <div>Please login to see your requests.</div>;

    return (
      <div className="requests-page">
        <h2>Your Message Requests</h2>

        {loading ? (
          <p>Loading…</p>
        ) : requests.length === 0 ? (
          <p>No requests (incoming or outgoing).</p>
        ) : (
          <>
            <section className="requests-section">
              <h3>Incoming</h3>
              {requests
                .filter((r) => r.to && r.to._id === user.id && r.status === "pending")
                .map((r) => (
                  <div key={r._id} className="request-card">
                    <img
                      src={(r.from && (r.from.avatarUrl || this.PLACEHOLDER_AVATAR)) || this.PLACEHOLDER_AVATAR}
                      alt="avatar"
                      className="request-card__avatar"
                    />
                    <div className="request-card__details">
                      <div className="request-card__name">{r.from?.name}</div>
                      <div className="request-card__email">{r.from?.email}</div>
                      {r.text && <div className="request-card__message">{r.text}</div>}
                    </div>
                    <div className="request-card__actions">
                      <button
                        onClick={() => this.handleAccept(r._id)}
                        disabled={actioning === r._id}
                        className="request-card__button"
                      >
                        {actioning === r._id ? "..." : "Accept"}
                      </button>
                      <button
                        onClick={() => this.handleReject(r._id)}
                        disabled={actioning === r._id}
                        className="request-card__button request-card__button--secondary"
                      >
                        {actioning === r._id ? "..." : "Reject"}
                      </button>
                    </div>
                  </div>
                ))}
            </section>

            <section className="requests-section">
              <h3>Outgoing</h3>
              {requests
                .filter((r) => r.from && r.from._id === user.id)
                .map((r) => (
                  <div key={r._id} className="request-card">
                    <img
                      src={(r.to && (r.to.avatarUrl || this.PLACEHOLDER_AVATAR)) || this.PLACEHOLDER_AVATAR}
                      alt="avatar"
                      className="request-card__avatar"
                    />
                    <div className="request-card__details">
                      <div className="request-card__name">{r.to?.name}</div>
                      <div className="request-card__email">{r.to?.email}</div>
                      <div className="request-card__status">Status: {r.status}</div>
                      {r.text && <div className="request-card__message">{r.text}</div>}
                    </div>
                  </div>
                ))}
            </section>
          </>
        )}
      </div>
    );
  }
}

export default withAuth(Requests);

