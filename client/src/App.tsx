<<<<<<< HEAD
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
=======
import React from 'react';
import { 
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import Home from './pages/Home/Home';
import Catalogue from './pages/Catalogue/Catalogue';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/lists/:user_id" element={<Home />}/>
        <Route path="/list/:catalogue_id" element={<Catalogue />}/>
      </Routes>
    </Router>
>>>>>>> michael
  );
};

export default App;
