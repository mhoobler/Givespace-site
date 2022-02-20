import React from "react";
import { IconButton } from "../..";
import { ChevronDown, ChevronUp } from "../../../assets";

import { DropDownContext } from "./Dropdown";

type ToggleProps = {
  disable?: boolean;
  className?: string;
};

const Toggle: React.FC<ToggleProps> = ({ className, disable }) => {
  const { activeValue, show, setShow } = React.useContext(DropDownContext);
  const handleToggle = () => {
    setShow((prev: boolean) => !prev);
  };
  console.log(className);

  return (
    <div className={`dropdown-toggle ${className ? className : ""}`}>
      <span>{activeValue}</span>
      {!disable && (
        <IconButton
          src={show ? ChevronUp : ChevronDown}
          onClick={handleToggle}
        />
      )}
    </div>
  );
};

export default Toggle;
