import React from "react";

import { DropDownContext } from "./Dropdown";

type ToggleProps = {
  disable: boolean;
  className?: string;
};

const Toggle: React.FC<ToggleProps> = ({ className, disable, children }) => {
  const { activeValue, setShow } = React.useContext(DropDownContext);
  const handleToggle = () => {
    setShow((prev: boolean) => !prev);
  };

  if (disable) {
    return (
      <div className={`${!className && ""} ${disable && "disable"}`}>
        {activeValue}
      </div>
    );
  }

  return (
    <div
      className={`dropdown-toggle ${!className && ""}`}
      onClick={handleToggle}
    >
      {activeValue}
    </div>
  );
};

export default Toggle;
