import React, { useEffect, useState } from "react";

import Toggle from "./Toggle";
import Menu from "./Menu";
import Item from "./Item";
import { useFieldEditing } from "../../../state/store";

type DropdownProps = {
  className?: string;
  handleSubmit: (value: string, objectKey: string) => any;
  keyProp: string;
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
  keyProp,
  value,
  children,
}) => {
  const [show, setShow] = useState(false);
  const [activeValue, setActiveValue] = useState(value);
  const { fieldEditing, setFieldEditing } = useFieldEditing();

  useEffect(() => {
    if (fieldEditing !== keyProp) {
      setActiveValue(value);
    }
  }, [value]);

  useEffect(() => {
    handleSubmit(activeValue, keyProp);
  }, [activeValue]);

  useEffect(() => {
    if (show) {
      setFieldEditing(keyProp);
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
