import React from "react";
import "./Home.css";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "Loading...",
    };
  }

  componentDidMount() {
    fetch("http://localhost:3000/api/hello")
      .then((res) => res.json())
      .then((data) =>
        this.setState({
          message: `${data.message} @ ${new Date(data.time).toLocaleTimeString()}`,
        })
      )
      .catch(() => this.setState({ message: "Backend not responding" }));
  }

  render() {
    return (
      <div className="home-page">
        <h3>Home Component</h3>
        <p>Message from backend: {this.state.message}</p>
      </div>
    );
  }
}

export default Home;

