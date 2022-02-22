import React from "react";

import { DropDownContext } from "./Dropdown";

type ItemProps = {
  value: string;
  title?: string;
  className?: string;
};

const Item: React.FC<ItemProps> = ({ children, className, value, title }) => {
  const { setActiveValue, setShow } = React.useContext(DropDownContext);

  const handleSelect = () => {
    setActiveValue(value);
    setShow(false);
  };

  return (
    <div
      title={title}
      className={`dropdown-item ${className ? className : ""}`}
      onClick={handleSelect}
    >
      {children}
    </div>
  );
};

export default Item;
