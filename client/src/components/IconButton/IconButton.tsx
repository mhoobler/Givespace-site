import React from "react";

import "./IconButton.less";

type Props = {
  className?: string;
  onClick: (args: any) => void;
  src: string;
};

const IconButton: React.FC<Props> = ({ className, onClick, src }) => {
  return (
    <button
      className={`icon-button ${className ? className : ""}`}
      onClick={onClick}
    >
      <img src={src} />
    </button>
  );
};

export default IconButton;
