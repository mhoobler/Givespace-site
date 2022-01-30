import React, { useState, useRef } from "react";

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
    if (isAdding) {
      addLabel(inputRef.current.value);
      inputRef.current.value = "";
      setIsAdding(false);
    } else {
      setIsAdding(true);
      inputRef.current.focus();
    }
  };

  return (
    <div className="d-flex labels-container">
      {children}
      <div className={`add-label-group ${isAdding ? "adding" : ""}`}>
        <input ref={inputRef} className="add-label-input" type="text" />
        <button className="add-label-button add" onClick={handleAddLabel}>
          +
        </button>
      </div>
    </div>
  );
};

export default LabelContainer;
