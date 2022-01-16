import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  // need some way to get user id here
  const user_id = "id";
  return (
    <div className="App">
      <header className="App-header">
        <p>Home</p>
        <Link className="btn btn-primary" to={`/lists/${user_id}`}>
          Go to Lists
        </Link>
      </header>
    </div>
  );
};

export default Home;
