import React, { useState, useRef } from "react";
import DragAndDrop from "../DragAndDrop/DragAndDrop";

import "./LabelContainer.less";

type Props = {
  addLabel: (name: string) => void;
};

const LabelContainer: React.FC<Props> = ({ addLabel, children }) => {
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleAddLabel = () => {
    if (!inputRef.current) {
      throw new Error("Could not get input");
    }
    console.log(inputRef.current.value);
    if (isAdding) {
      if (inputRef.current.value !== "") {
        console.log("isEmpty");
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
    <DragAndDrop>
      <div className="d-flex labels-container">
        {children}
        <div className={`f-center add-label-group ${isAdding ? "adding" : ""}`}>
          <input ref={inputRef} className="add-label-input" type="text" />
          <button className="add-label-button add" onClick={handleAddLabel}>
            +
          </button>
        </div>
      </div>
    </DragAndDrop>
  );
};

export default LabelContainer;
