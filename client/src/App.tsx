import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, Catalogue, CatalogueSelect } from "./pages";
import { useQuery } from "@apollo/client";
import { MY_CATALOGUES } from "./graphql/schemas";
import { apolloHookErrorHandler } from "./utils/functions";

import "./App.less";
import { useCurrentlyUndo, useRemove } from "./state/store";

const App = () => {
  const { remove, setRemove } = useRemove();
  const { currentlyUndo, setCurrentlyUndo } = useCurrentlyUndo();
  const myCatalogues = useQuery(MY_CATALOGUES);
  apolloHookErrorHandler("App.tsx", myCatalogues.error);

  useEffect(() => {
    if (remove && currentlyUndo.find((cu) => cu.id === remove)) {
      console.log("Removing from currentlyUndo", remove);
      setCurrentlyUndo(currentlyUndo.filter((cui) => cui.id !== remove));
      setRemove(null);
    }
  }, [remove, setRemove, currentlyUndo, setCurrentlyUndo]);

  return (
    <div className="app">
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
    </div>
  );
};

export default App;
