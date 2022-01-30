import React, { createContext } from "react";

const DNDContext = createContext<any>({});
const DNDProvider = DNDContext.Provider;

const DragAndDrop: React.FC = () => {
  return <DNDProvider></DNDProvider>;
};

export default DragAndDrop;
