import React, { useEffect, useState } from "react";
import { useFieldEditing } from "../../../state/store";
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
  const { setFieldEditing } = useFieldEditing();

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleBlur = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    const { value } = evt.currentTarget;
    setFieldEditing(null);
    handleSubmit(value, keyProp);
  };

  const handleFocus = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    setFieldEditing(keyProp);
  };

  return (
    <ToggleEdit isEditing={isEditing}>
      <input
        className={`toggle-input standard-text-input ${className || ""}`}
        type="text"
        onChange={(e) => setText(e.target.value)}
        onFocus={handleFocus}
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
