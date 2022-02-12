import React, { useEffect, useContext } from "react";
import { DNDContext } from "./DragAndDrop";

type Props = {
  refData: any;
};

const Draggable: React.FC<Props> = ({ children, refData }) => {
  const { captureRef, clearRef } = useContext(DNDContext);

  useEffect(() => {
    return () => {
      clearRef(refData.id);
    };
  }, []);

  return <div ref={(elm) => captureRef(elm, refData)}>{children}</div>;
};

export default Draggable;
