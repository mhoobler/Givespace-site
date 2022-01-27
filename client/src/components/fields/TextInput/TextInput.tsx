import React, { useEffect, useState } from "react";
import ToggleEdit from "../../ToggleEdit/ToggleEdit";
import "./TextInput.less";

type Props = {
  isEditing: boolean;
  handleSubmit: (value: string) => any;
  value: string;
  className?: string;
};

const TextInput = ({ isEditing, handleSubmit, value, className }: Props) => {
  const [text, setText] = useState(value);
  useEffect(() => {
    setText(value);
  }, [value]);
  return (
    <ToggleEdit isEditing={isEditing}>
      <input
        className={`toggle-input standard-text-input ${className}`}
        type="text"
        onChange={(e) => setText(e.target.value)}
        value={text}
        onBlur={(e) => handleSubmit(e.target.value)}
      />
      <div className={`toggle-display standard-text-display ${className}`}>
        {value}
      </div>
    </ToggleEdit>
  );
};

export default TextInput;
