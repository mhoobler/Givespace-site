import React, { useState } from "react";
import ToggleEdit from "../../ToggleEdit/ToggleEdit";

type Props = {
  isEditing: boolean;
  handleSubmit: (value: string) => any;
  value: string;
  className?: string;
};

const FileInput: React.FC<Props> = ({
  isEditing,
  handleSubmit,
  value,
  className,
}) => {
  const [file, setFile] = useState(undefined);

  return (
    <ToggleEdit isEditing={isEditing}>
      <input
        className={`toggle-input standard-text-input ${className}`}
        type="file"
        onChange={(e) => console.log(e)}
        accept="*.png,*.jpeg,*.jpg"
        value={file}
      />
      <div className={`toggle-display`}>{value}</div>
    </ToggleEdit>
  );
};

export default FileInput;
