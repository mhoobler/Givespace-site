import React, { useEffect, useRef, useState } from "react";
import { useFieldEditing } from "../../../state/store";
import ToggleEdit from "../../ToggleEdit/ToggleEdit";

import "./TextareaInput.less";

type Props = {
  isEditing: boolean;
  handleSubmit: GenericEdit;
  value: string;
  fieldEditingProp: FieldEditing;
  validator?: (value: string) => boolean;
  placeholder?: string;
  className?: string;
};

const TextareaInput = ({
  isEditing,
  handleSubmit,
  value,
  fieldEditingProp,
  validator,
  placeholder,
  className,
}: Props) => {
  const textarea = useRef<HTMLTextAreaElement>();
  const [isValid, setIsValid] = useState(true);
  const [text, setText] = useState(value);
  const { setFieldEditing } = useFieldEditing();
  useEffect(() => {
    setText(value);
  }, [value]);

  const handleBlur = (evt: FocusEvent) => {
    if (!evt.currentTarget) {
      throw new Error("no current target");
    }
    const currentTarget = evt.currentTarget as HTMLTextAreaElement;
    const currentlyIsValid = !validator || validator(currentTarget.value);
    setIsValid(currentlyIsValid);
    const { value } = currentTarget;

    if (currentlyIsValid && value) {
      setFieldEditing(null);
      handleSubmit(value, fieldEditingProp.key);
    }
  };
  const handleFocus = () => {
    console.log("handle focus");
    setFieldEditing(fieldEditingProp);
  };
  useEffect(() => {
    if (textarea.current) {
      textarea.current.addEventListener("focus", handleFocus);
      textarea.current.addEventListener("blur", handleBlur);
    }
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
        name={fieldEditingProp.key}
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
