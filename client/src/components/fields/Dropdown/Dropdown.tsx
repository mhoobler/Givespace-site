import React, { useEffect, useState } from "react";

import Toggle from "./Toggle";
import Menu from "./Menu";
import Item from "./Item";
import { useFieldEditing } from "../../../state/store";

import "./Dropdown.less";

type DropdownProps = {
  className?: string;
  handleSubmit: GenericEdit;
  fieldEditingProps: FieldEditing;
  value: string;
};

interface IContext {
  show: boolean;
  activeValue: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveValue: React.Dispatch<React.SetStateAction<string>>;
}

const DropDownContext = React.createContext<IContext>({
  show: false,
  activeValue: "",
  setShow: (_) => null,
  setActiveValue: (_) => null,
});

const DropDownProvider = DropDownContext.Provider;

const Dropdown: React.FC<DropdownProps> = ({
  className,
  handleSubmit,
  fieldEditingProps,
  value,
  children,
}) => {
  const [show, setShow] = useState(false);
  const [activeValue, setActiveValue] = useState(value);
  const { fieldEditing, setFieldEditing } = useFieldEditing();

  useEffect(() => {
    if (
      !fieldEditing ||
      (fieldEditing.key !== fieldEditingProps.key &&
        fieldEditing.typename !== fieldEditingProps.typename)
    ) {
      setActiveValue(value);
    }
  }, [value]);

  useEffect(() => {
    handleSubmit(activeValue, fieldEditingProps.key);
  }, [activeValue]);

  useEffect(() => {
    if (show) {
      setFieldEditing(fieldEditingProps);
    } else {
      setFieldEditing(null);
    }
  }, [show]);

  const handleBlur = () => {
    setShow(false);
  };

  return (
    <DropDownProvider value={{ activeValue, setActiveValue, show, setShow }}>
      <div
        tabIndex={0}
        onBlur={handleBlur}
        className={`drop ${show && "show"} ${!className && ""}`}
      >
        {children}
      </div>
    </DropDownProvider>
  );
};

export default Object.assign(Dropdown, {
  Toggle,
  Menu,
  Item,
});

export { DropDownContext };
