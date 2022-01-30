import React, { useContext, useEffect } from "react";
import { DNDContext } from "../DragAndDrop/DragAndDrop";

import "./Label.less";

type LabelProps = {
  isEditing: boolean;
  deleteLabel: (id: string) => void;
  label: Label;
  className?: string;
};

const Label: React.FC<LabelProps> = ({ isEditing, deleteLabel, label }) => {
  const { captureRef, clearRef } = useContext(DNDContext);

  useEffect(() => {
    return () => {
      clearRef(label.id);
    };
  }, []);

  const handleDeleteClick = () => {
    deleteLabel(label.id);
  };

  return (
    <div
      ref={(elm) => {
        captureRef(elm, label.id);
      }}
      className={`label f-center ${isEditing ? "show-delete" : ""}`}
    >
      <span>{label.name}</span>
      <button className="delete-label" onClick={handleDeleteClick}>
        x
      </button>
    </div>
  );
};

export default Label;
