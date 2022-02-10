import React, { useEffect, useState } from "react";
import { useFieldEditing } from "../../../state/store";
import ToggleEdit from "../../ToggleEdit/ToggleEdit";
import "./TextInput.less";

type Props = {
  isEditing: boolean;
  handleSubmit: CatalogueHook.editCatalogue;
  value: string;
  keyProp: string;
  validator?: (value: string) => boolean;
  placeholder?: string;
  className?: string;
};

const TextInput = ({
  isEditing,
  handleSubmit,
  value,
  keyProp,
  validator,
  placeholder,
  className,
}: Props) => {
  const [isValid, setIsValid] = useState(true);
  const [text, setText] = useState(value);
  const { setFieldEditing } = useFieldEditing();

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleBlur = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    const currentlyIsValid = !validator || validator(text);
    setIsValid(currentlyIsValid);
    if (currentlyIsValid) {
      setFieldEditing(null);
      handleSubmit(text, keyProp);
    }
  };

  const handleFocus = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    setFieldEditing(keyProp);
  };

  return (
    <ToggleEdit isEditing={isEditing}>
      <input
        className={`toggle-input standard-text-input ${
          isValid ? "" : "invalid_input"
        } ${className || ""}`}
        type="text"
        onChange={(e) => setText(e.target.value)}
        onFocus={handleFocus}
        name={keyProp}
        value={text}
        onBlur={handleBlur}
        placeholder={placeholder || ""}
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
