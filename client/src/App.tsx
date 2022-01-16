import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { useQuery } from "@apollo/client";
import { GET_JWT } from "./graphql/schemas";
import { Home, Catalogue, CatalogueSelect } from "./pages";

const App = () => {
  //@ts-ignore
  const jwt = useQuery(GET_JWT);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lists/:user_id" element={<CatalogueSelect />} />
        <Route path="/list/:catalogue_id" element={<Catalogue />} />
      </Routes>
    </Router>
  );
};

export default App;
