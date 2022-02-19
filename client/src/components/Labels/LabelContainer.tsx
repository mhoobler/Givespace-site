import React, { KeyboardEvent, useState, useRef } from "react";
import { IconButton } from "..";
import { Plus } from "../../assets";

import "./LabelContainer.less";

type Props = {
  createLabel?: (name: string) => void;
  isEditing?: boolean;
};

const LabelContainer: React.FC<Props> = ({
  createLabel,
  isEditing,
  children,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleAddLabel = () => {
    if (!inputRef.current) {
      throw new Error("Could not get labels input");
    }
    if (!containerRef.current) {
      throw new Error("Could not get labels container");
    }
    if (createLabel && isAdding) {
      if (inputRef.current.value !== "") {
        createLabel(inputRef.current.value);
      }

      inputRef.current.value = "";
      setIsAdding(false);
    } else {
      setIsAdding(true);
      inputRef.current.focus();
    }
  };

  const inputKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === "Enter" && inputRef.current && createLabel) {
      const target = inputRef.current;

      createLabel(target.value);
      target.value = "";
    }
  };

  return (
    <div className="labels-container" ref={containerRef}>
      {children}
      {createLabel && isEditing && (
        <div className={`f-center add-label-group ${isAdding ? "adding" : ""}`}>
          <input
            ref={inputRef}
            onKeyDown={inputKeyDown}
            className="add-label-input"
            type="text"
          />
          <IconButton
            className="add-label-button"
            src={Plus}
            onClick={handleAddLabel}
          />
        </div>
      )}
    </div>
  );
};

export default LabelContainer;
