import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { Home, Catalogue, CatalogueSelect } from "./pages";
import { useQuery } from "@apollo/client";
import { MY_CATALOGUES } from "./graphql/schemas";

const App = () => {
  const myCatalogues = useQuery(MY_CATALOGUES);
  console.log("myCatalogues.data", myCatalogues.data);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lists" element={<CatalogueSelect />} />
        <Route path="/list/:catalogue_id" element={<Catalogue />} />
      </Routes>
    </Router>
  );
};

export default App;
