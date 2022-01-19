import React from "react";

import "./ToggleEdit.less";

type Props = {
  isEditing: boolean;
  className?: string;
  style?: React.CSSProperties;
};

const ToggleEdit: React.FC<Props> = ({
  className,
  style,
  isEditing,
  children,
}) => {
  const classes = [
    "toggle-edit",
    `${isEditing ? "input" : "display"}`,
    className,
  ].join(" ");

  return (
    <div style={style} className={classes}>
      {children}
    </div>
  );
};

export default ToggleEdit;
