import React, { useEffect, useState } from "react";

import Toggle from "./Toggle";
import Menu from "./Menu";
import Item from "./Item";

type DropdownProps = {
  className?: string;
  handleSubmit: (value: string) => any;
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
  value,
  children,
}) => {
  const [show, setShow] = useState(false);
  const [activeValue, setActiveValue] = useState(value);

  useEffect(() => {
    handleSubmit(activeValue);
  }, [activeValue]);

  return (
    <DropDownProvider value={{ activeValue, setActiveValue, show, setShow }}>
      <div className={`drop ${show && "show"} ${!className && ""}`}>
        {children}
      </div>
      ;
    </DropDownProvider>
  );
};

export default Object.assign(Dropdown, {
  Toggle,
  Menu,
  Item,
});

export { DropDownContext };
