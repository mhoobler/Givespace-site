import React from "react";
import { useMarkedForDeletion } from "../../state/store";

const UndoNotification = (): React.ReactElement => {
  const { markedForDeletion, setMarkedForDeletion } = useMarkedForDeletion();

  const handleUndoDeletion = (currentCacheId: string) => {
    setMarkedForDeletion(
      markedForDeletion.filter((cacheId) => cacheId !== currentCacheId)
    );
  };

  return (
    <div>
      {markedForDeletion.map((cacheId: string) => (
        <button onClick={() => handleUndoDeletion(cacheId)} key={cacheId}>
          Undo deletion of {cacheId}
        </button>
      ))}
    </div>
  );
};

export default UndoNotification;
