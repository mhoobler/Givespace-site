import React from "react";

import ToggleEdit from "../../ToggleEdit/ToggleEdit";

type Props = {
  isEditing: boolean;
  handleSubmit: (value: string) => any;
  options: [string, string][];
  className?: string;
};

const DropdownInput: React.FC<Props> = ({
  isEditing,
  handleSubmit,
  options,
  className,
}) => {
  return (
    <ToggleEdit isEditing={isEditing}>
      <select className={`toggle-input standard-text-input ${className}`}>
        {options.map(([label, value]) => (
          <option value={value} key={value}>
            {label}
          </option>
        ))}
      </select>
    </ToggleEdit>
  );
};

export default DropdownInput;
