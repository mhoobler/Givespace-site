import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import Home from "./pages/Home/Home";
import Catalogue from "./pages/Catalogue/Catalogue";
import { useQuery } from "@apollo/client";
import { GET_JWT } from "./graphql/schemas";

const App = () => {
  const jwt = useQuery(GET_JWT);

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/lists/:user_id' element={<Home />} />
        <Route path='/list/:catalogue_id' element={<Catalogue />} />
      </Routes>
    </Router>
  );
};

export default App;
