import React, { useEffect, useRef, useState } from "react";
import { useFieldEditing } from "../../../state/store";
import ToggleEdit from "../../ToggleEdit/ToggleEdit";

type Props = {
  isEditing: boolean;
  handleSubmit: GenericEdit;
  value: string;
  keyProp: string;
  validator?: (value: string) => boolean;
  placeholder?: string;
  className?: string;
};

const TextareaInput = ({
  isEditing,
  handleSubmit,
  value,
  keyProp,
  validator,
  placeholder,
  className,
}: Props) => {
  const textarea = useRef();
  const [isValid, setIsValid] = useState(true);
  const [text, setText] = useState(value);
  const { setFieldEditing } = useFieldEditing();
  useEffect(() => {
    setText(value);
  }, [value]);

  const handleBlur = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    const currentlyIsValid = !validator || validator(evt.currentTarget.value);
    setIsValid(currentlyIsValid);
    const { value } = evt.currentTarget;
    if (currentlyIsValid) {
      setFieldEditing(null);
      handleSubmit(value, keyProp);
    }
  };
  const handleFocus = () => {
    setFieldEditing(keyProp);
  };
  useEffect(() => {
    // @ts-ignore
    textarea.current.addEventListener("focus", handleFocus);
    // @ts-ignore
    textarea.current.addEventListener("blur", handleBlur);
  }, [textarea]);

  return (
    <ToggleEdit isEditing={isEditing}>
      <textarea
        // @ts-ignore
        ref={textarea}
        autoFocus={false}
        className={`toggle-input standard-text-input ${
          isValid ? "" : "invalid_input"
        } ${className || ""}`}
        onChange={(e) => setText(e.target.value)}
        name={keyProp}
        value={text}
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

export default TextareaInput;
