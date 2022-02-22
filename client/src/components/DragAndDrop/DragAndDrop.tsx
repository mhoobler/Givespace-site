import React, { createContext, useRef } from "react";
import DragHelper from "./DragHelper";

const DNDContext = createContext<any>({});
const DNDProvider = DNDContext.Provider;

type Props = {
  handleReorder: (id: string, ordering: number) => void;
};

const DragAndDrop: React.FC<Props> = ({ handleReorder, children }) => {
  const elementsRef = useRef<DragHelper>(new DragHelper(handleReorder));

  return (
    <DNDProvider value={{ DragHelper: elementsRef.current }}>
      {children}
    </DNDProvider>
  );
};

export { DNDContext };
export default DragAndDrop;
