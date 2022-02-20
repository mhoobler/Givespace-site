import React from "react";

import { DropDownContext } from "./Dropdown";

type ItemProps = {
  value: string;
  className?: string;
};

const Item: React.FC<ItemProps> = ({ children, className, value }) => {
  const { setActiveValue, setShow } = React.useContext(DropDownContext);

  const handleSelect = () => {
    setActiveValue(value);
    setShow(false);
  };

  return (
    <div
      className={`dropdown-item ${className ? className : ""}`}
      onClick={handleSelect}
    >
      {children}
    </div>
  );
};

export default Item;
