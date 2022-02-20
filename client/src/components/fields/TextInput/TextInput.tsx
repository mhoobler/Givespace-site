import React, { useEffect, useState } from "react";
import { useFieldEditing } from "../../../state/store";
import ToggleEdit from "../../ToggleEdit/ToggleEdit";
import "./TextInput.less";

type Props = {
  isEditing: boolean;
  handleSubmit: GenericEdit;
  value: string;
  fieldEditingProp: FieldEditing;
  validator?: (value: string) => boolean;
  placeholder?: string;
  className?: string;
};

// TODO: update keyProp and setFieldEditing
const TextInput = ({
  isEditing,
  handleSubmit,
  value,
  fieldEditingProp,
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
      handleSubmit(text, fieldEditingProp.key);
      evt.currentTarget.blur();
    }
  };

  const handleFocus = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    setFieldEditing(fieldEditingProp);
  };
  const handleOnEnter = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === "Enter") {
      handleBlur(evt);
    }
  };

  return (
    <ToggleEdit isEditing={isEditing}>
      <input
        className={`toggle-input standard-text-input ${
          isValid ? "" : "invalid_input"
        } ${className || ""}`}
        type="text"
        onKeyPress={handleOnEnter}
        onChange={(e) => setText(e.target.value)}
        onFocus={handleFocus}
        name={fieldEditingProp.key}
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
