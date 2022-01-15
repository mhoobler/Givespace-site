import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useQuery } from "@apollo/client";
import { GET_JWT } from "./graphql/schemas";

const App: React.FC = () => {
  // create a usequery hook with GET_JWT that fetches on button click

  const jwt = useQuery(GET_JWT);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>jwt: {jwt.loading ? "loading..." : jwt.data.getJwt}</p>
      </header>
    </div>
  );
};

export default App;
