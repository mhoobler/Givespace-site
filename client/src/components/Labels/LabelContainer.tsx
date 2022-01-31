import React, { useState, useRef } from "react";
import DragAndDrop from "../DragAndDrop/DragAndDrop";

import "./LabelContainer.less";

type Props = {
  addLabel: (name: string) => void;
  isEditing: boolean;
  reorderLabel: (id: string, ordering: number) => void;
};

const LabelContainer: React.FC<Props> = ({
  addLabel,
  isEditing,
  reorderLabel,
  children,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleAddLabel = () => {
    if (!inputRef.current) {
      throw new Error("Could not get input");
    }
    if (isAdding) {
      if (inputRef.current.value !== "") {
        addLabel(inputRef.current.value);
      }

      inputRef.current.value = "";
      setIsAdding(false);
    } else {
      setIsAdding(true);
      inputRef.current.focus();
    }
  };

  return (
    <DragAndDrop reorderLabel={reorderLabel}>
      <div className="d-flex labels-container">
        {children}
        {isEditing && (
          <div
            className={`f-center add-label-group ${isAdding ? "adding" : ""}`}
          >
            <input ref={inputRef} className="add-label-input" type="text" />
            <button className="add-label-button add" onClick={handleAddLabel}>
              +
            </button>
          </div>
        )}
      </div>
    </DragAndDrop>
  );
};

export default LabelContainer;
