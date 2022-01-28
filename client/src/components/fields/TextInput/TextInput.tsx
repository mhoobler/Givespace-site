import React, { useEffect, useState } from "react";
import ToggleEdit from "../../ToggleEdit/ToggleEdit";
import "./TextInput.less";

type Props = {
  isEditing: boolean;
  handleSubmit: (value: string, objectKey: string) => void;
  value: string;
  keyProp: string;
  className?: string;
};

const TextInput = ({
  isEditing,
  handleSubmit,
  value,
  keyProp,
  className,
}: Props) => {
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleBlur = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    const { value } = evt.currentTarget;
    handleSubmit(value, keyProp);
  };

  return (
    <ToggleEdit isEditing={isEditing}>
      <input
        className={`toggle-input standard-text-input ${className || ""}`}
        type="text"
        onChange={(e) => setText(e.target.value)}
        name={keyProp}
        value={text}
        onBlur={handleBlur}
      />
      <div
        className={`toggle-display standard-text-display ${className || ""}`}
      >
        {value}
      </div>
    </ToggleEdit>
  );
};

export default TextInput;
