import React from "react";
import { useMarkedForDeletion, useRemoveMFD } from "../../state/store";

const UndoNotification = () => {
  const { markedForDeletion } = useMarkedForDeletion();
  const { setRemoveMFD } = useRemoveMFD();
  return (
    <div>
      {markedForDeletion.map((mfd) => (
        <button
          key={mfd.id}
          onClick={() => {
            clearTimeout(mfd.timeout);
            setRemoveMFD({ id: mfd.id, isUndo: true });
          }}
        >
          Undo {mfd.text}
        </button>
      ))}
    </div>
  );
};

export default UndoNotification;
