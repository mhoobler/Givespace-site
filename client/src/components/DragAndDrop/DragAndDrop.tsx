import React, { createContext, useRef } from "react";
import DragHelper from "./DragHelper";

const DNDContext = createContext<any>({});
const DNDProvider = DNDContext.Provider;

type Props = {
  disabled?: boolean;
  handleReorder: (id: string, ordering: number) => void;
};

const DragAndDrop: React.FC<Props> = ({
  handleReorder,
  disabled,
  children,
}) => {
  const elementsRef = useRef<DragHelper>(new DragHelper(handleReorder));
  elementsRef.current.disabled = disabled || false;

  return (
    <DNDProvider value={{ DragHelper: elementsRef.current }}>
      {children}
    </DNDProvider>
  );
};

export { DNDContext };
export default DragAndDrop;
