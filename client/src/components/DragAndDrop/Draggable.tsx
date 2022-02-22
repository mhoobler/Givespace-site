import React, { useEffect, useContext } from "react";
import { DNDContext } from "./DragAndDrop";

type Props = {
  refData: any;
};

const Draggable: React.FC<Props> = ({ children, refData }) => {
  const { DragHelper } = useContext(DNDContext);

  useEffect(() => {
    return () => {
      DragHelper.clearRef(refData.id);
    };
  }, []);

  return (
    <div ref={(elm) => DragHelper.captureRef(elm, refData)}>{children}</div>
  );
};

export default Draggable;
