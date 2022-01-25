import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, Catalogue, CatalogueSelect } from "./pages";
import { useQuery } from "@apollo/client";
import { MY_CATALOGUES } from "./graphql/schemas";
import { apolloHookErrorHandler } from "./utils/functions";

import "./App.css";

const App = () => {
  const myCatalogues = useQuery(MY_CATALOGUES);
  apolloHookErrorHandler("App.tsx", myCatalogues.error);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lists" element={<CatalogueSelect />} />
        <Route path="/list/:corresponding_id" element={<Catalogue />} />
        <Route
          path="/list/edit/:corresponding_id"
          element={<Catalogue is_edit_id />}
        />
      </Routes>
    </Router>
  );
};

export default App;
