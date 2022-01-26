import React, { useState } from "react";

import ToggleEdit from "../../ToggleEdit/ToggleEdit";

type Props = {
  isEditing: boolean;
  handleSubmit: (value: string) => any;
  value: string;
  className?: string;
};

const DropdownInput: React.FC<Props> = ({
  isEditing,
  handleSubmit,
  value,
  className,
}) => {
  const formatValue = value.charAt(0).toUpperCase() + value.slice(1);
  const [show, setShow] = useState(false);

  const handleInputChange = (value: string) => {
    console.log(value);
  };

  const toggleDropdown = () => setShow((prev) => !prev);

  return (
    <ToggleEdit isEditing={isEditing}>
      <div className={`toggle-input dropdown ${className} ${show && "show"}`}>
        <button
          className="btn btn-secondary dropdown-toggle"
          onClick={toggleDropdown}
        >
          {formatValue}
        </button>
        <div className={`dropdown-menu ${show && "show"}`}>
          <div
            className="dropdown-item"
            onClick={() => handleInputChange("public")}
          >
            <span>Public</span>
          </div>
          <div
            className="dropdown-item"
            onClick={() => handleInputChange("shareable")}
          >
            <span>Shareable</span>
          </div>
          <div
            className="dropdown-item"
            onClick={() => handleInputChange("private")}
          >
            <span>Private</span>
          </div>
        </div>
      </div>
      <div className={`toggle-display`}>{formatValue}</div>
    </ToggleEdit>
  );
};

export default DropdownInput;
