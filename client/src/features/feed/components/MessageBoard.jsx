import React from "react";
import "./MessageBoard.css";

class MessageBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      text: "",
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchMessages();
  }

  fetchMessages = () => {
    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => this.setState({ messages: data || [] }))
      .catch(() => this.setState({ messages: [] }));
  };

  handleTextChange = (e) => {
    this.setState({ text: e.target.value });
  };

  submit = async (e) => {
    e.preventDefault();
    if (!this.state.text.trim()) return;
    this.setState({ loading: true });
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: this.state.text }),
      });
      if (!res.ok) throw new Error("Failed");
      this.setState({ text: "" });
      this.fetchMessages();
    } catch {
      alert("Could not post message");
    } finally {
      this.setState({ loading: false });
    }
  };

  handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("Delete failed", body);
        return alert(body.error || "Failed to delete message");
      }
      this.setState((prevState) => ({
        messages: prevState.messages.filter((m) => (m._id || m.id || String(m.id)) !== messageId),
      }));
    } catch (err) {
      console.error("Network error while deleting", err);
      alert("Network error while deleting message");
    }
  };

  render() {
    const { messages, text, loading } = this.state;

    return (
      <section className="message-board">
        <h3>Message Board</h3>

        <form onSubmit={this.submit} className="message-board__form">
          <input
            value={text}
            onChange={this.handleTextChange}
            placeholder="Write a short message..."
            className="message-board__input"
          />
          <button type="submit" disabled={loading} className="message-board__submit">
            {loading ? "Posting..." : "Post"}
          </button>
        </form>

        <div className="message-board__list">
          {messages.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            messages
              .slice()
              .reverse()
              .map((m) => {
                const id = m._id || m.id || String(m.id);
                return (
                  <div key={id} className="message-board__item">
                    <div className="message-board__content">
                      <div className="message-board__text">{m.text}</div>
                      <div className="message-board__meta">{m.time ? new Date(m.time).toLocaleString() : ""}</div>
                    </div>

                    <div className="message-board__actions">
                      <button onClick={() => this.handleDeleteMessage(id)} className="message-board__delete-button">
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </section>
    );
  }
}

export default MessageBoard;

