import React from "react";
import { withAuth } from "../../../hoc/withAuth";
import MessageBoard from "../components/MessageBoard";
import "./Feed.css";

class Feed extends React.Component {
  render() {
    const { auth } = this.props;
    const { user } = auth;

    return (
      <div className="feed-page">
        <h2>Welcome{user ? `, ${user.name}` : ""} — Feed</h2>
        <section className="feed-page__intro">
          <p>
            This is your social feed. Right now it shows the message board (posts). Later we'll add posts from people you
            follow, a list of profiles, likes, and one-time message flow.
          </p>
        </section>
        <MessageBoard />
      </div>
    );
  }
}

export default withAuth(Feed);

