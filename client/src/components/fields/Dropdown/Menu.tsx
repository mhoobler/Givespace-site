import React from "react";

import { DropDownContext } from "./Dropdown";

type MenuProps = {
  className?: string;
};

const Menu: React.FC<MenuProps> = ({ children, className }) => {
  const { show } = React.useContext(DropDownContext);
  return (
    <div
      className={`dropdown-menu ${show && "show"} ${
        className ? className : ""
      }`}
    >
      {children}
    </div>
  );
};

export default Menu;
