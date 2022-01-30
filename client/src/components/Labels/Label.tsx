import React from "react";

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
    <div className={`label ${isEditing ? "show-delete" : ""}`}>
      <span>{label.name}</span>
      <button className="delete-label" onClick={handleDeleteClick}>
        X
      </button>
    </div>
  );
};

export default Label;
