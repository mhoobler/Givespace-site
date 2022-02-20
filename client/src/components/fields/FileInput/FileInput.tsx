import React, { useState } from "react";
import ToggleEdit from "../../ToggleEdit/ToggleEdit";

type Props = {
  isEditing: boolean;
  handleSubmit: GenericFileEdit;
  value: string;
  keyProp: string;
  className?: string;
};

const FileInput: React.FC<Props> = ({
  isEditing,
  handleSubmit,
  keyProp,
  value,
  className,
}) => {
  const [file, setFile] = useState<File | undefined>(undefined);

  const handleFileInput = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    const { files } = evt.currentTarget;
    if (files && files[0]) {
      setFile(files[0]);
      handleSubmit(files[0], keyProp);
      console.log("file changed: ", file);
    } else {
      console.error("No file selected");
    }
  };

  return (
    <ToggleEdit isEditing={isEditing}>
      <input
        className={`toggle-input standard-text-input ${className || ""}`}
        type="file"
        onChange={handleFileInput}
        name={keyProp}
        accept="*.png,*.jpeg,*.jpg,*.txt ,*.gif"
      />
      <img src={value} alt="" />
    </ToggleEdit>
  );
};

export default FileInput;
