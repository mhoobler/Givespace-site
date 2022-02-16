import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, Catalogue, CatalogueSelect } from "./pages";
import { useQuery } from "@apollo/client";
import { MY_CATALOGUES } from "./graphql/schemas";
import { apolloHookErrorHandler } from "./utils/functions";

import "./App.less";
import { useMarkedForDeletion, useRemoveMFD } from "./state/store";
import { cache } from "./graphql/clientConfig";

const App = () => {
  const { removeMFD, setRemoveMFD } = useRemoveMFD();
  const { markedForDeletion, setMarkedForDeletion } = useMarkedForDeletion();
  const myCatalogues = useQuery(MY_CATALOGUES);
  apolloHookErrorHandler("App.tsx", myCatalogues.error);

  useEffect(() => {
    // handling undo and clearing of undo list
    if (removeMFD && markedForDeletion.find((mfd) => mfd.id === removeMFD.id)) {
      const currentMFD = markedForDeletion.find(
        (mfd) => mfd.id === removeMFD.id
      )!;

      if (removeMFD.isUndo) {
        cache.writeFragment({
          id: currentMFD.id,
          fragment: currentMFD.fragment,
          fragmentName: currentMFD.fragmentName,
          data: currentMFD.data,
        });
      } else {
      }

      setMarkedForDeletion(
        markedForDeletion.filter((mfd) => mfd.id !== removeMFD.id)
      );

      setRemoveMFD(null);
    }
  }, [removeMFD, setRemoveMFD, markedForDeletion, setMarkedForDeletion]);

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lists" element={<CatalogueSelect />} />
          <Route path="/list/:corresponding_id/*" element={<Catalogue />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
