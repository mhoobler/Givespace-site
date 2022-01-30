import React, { createContext, useRef } from "react";
import { getMouseDown } from "./getFunction";

const DNDContext = createContext<any>({
  captureRef: () => null,
  clearRef: () => null,
  handleMouseDown: () => null,
});
const DNDProvider = DNDContext.Provider;

type asf = {
  elm: HTMLElement;
  mousedown: (evt: MouseEvent) => void;
};

type elmRefs = {
  [key: string]: asf;
};

const DragAndDrop: React.FC = ({ children }) => {
  const elementsRef = useRef<elmRefs>({});

  const captureRef = (elm: HTMLDivElement, id: string) => {
    if (!elementsRef.current[id]) {
      const ref = (elementsRef.current[id] = {
        elm,
        mousedown: getMouseDown(id, elementsRef.current),
      });
      ref.elm.addEventListener("mousedown", ref.mousedown);
    }
  };

  const clearRef = (id: string) => {
    delete elementsRef.current[id];
  };

  return <DNDProvider value={{ captureRef, clearRef }}>{children}</DNDProvider>;
};

export { DNDContext };
export default DragAndDrop;
