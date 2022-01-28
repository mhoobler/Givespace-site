import React, { useState } from "react";
import ToggleEdit from "../../ToggleEdit/ToggleEdit";

type Props = {
  isEditing: boolean;
  handleSubmit: (file: File | undefined) => any;
  value: string;
  className?: string;
};

const FileInput: React.FC<Props> = ({
  isEditing,
  handleSubmit,
  value,
  className,
}) => {
  const [file, setFile] = useState<File | undefined>(undefined);

  const handleFileInput = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    const { files } = evt.currentTarget;
    if (files && files[0]) {
      setFile(files[0]);
      handleSubmit(files[0]);
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
        accept="*.png,*.jpeg,*.jpg, *.txt"
      />
      <div className={`toggle-display`}>header_image_url: {value}</div>
    </ToggleEdit>
  );
};

export default FileInput;
