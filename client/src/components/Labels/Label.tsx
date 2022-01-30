import React from "react";

import "./Label.less";

type LabelProps = {
  isEditing: boolean;
  deleteLabel: (id: string) => void;
  label: Label;
  className?: string;
};

const Label: React.FC<LabelProps> = ({ isEditing, deleteLabel, label }) => {
  const handleDeleteClick = () => {
    deleteLabel(label.id);
  };

  return (
    <div className={`label f-center ${isEditing ? "show-delete" : ""}`}>
      <span>{label.name}</span>
      <button className="delete-label" onClick={handleDeleteClick}>
        x
      </button>
    </div>
  );
};

export default Label;
