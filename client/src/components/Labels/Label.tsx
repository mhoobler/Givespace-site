import React from "react";

import "./Label.less";

type LabelProps = {
  isEditing?: boolean;
  label: Label;
  faint?: boolean;
  deleteLabel?: (id: string) => void;
  onClick?: () => void;
  className?: string;
};

const Label: React.FC<LabelProps> = ({
  isEditing,
  faint,
  deleteLabel,
  label,
  onClick,
}) => {
  const handleDeleteClick = () => {
    if (deleteLabel) {
      deleteLabel(label.id);
    }
  };
  const handleClick = () => {
    if (isEditing && onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`label f-center ${
        isEditing && deleteLabel ? "show-delete" : ""
      } ${faint && "faint"}`}
    >
      <span>{label.name}</span>
      <button className="delete-label" onClick={handleDeleteClick}>
        x
      </button>
    </div>
  );
};

export default Label;
