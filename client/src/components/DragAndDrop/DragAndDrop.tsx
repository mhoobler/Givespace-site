import React, { createContext, useRef } from "react";
import { getMouseDown } from "./getFunction";

const DNDContext = createContext<any>({
  captureRef: () => null,
  clearRef: () => null,
  handleMouseDown: () => null,
});
const DNDProvider = DNDContext.Provider;

type elmRefs = {
  [key: string]: {
    elm: HTMLElement;
    data: any;
    mousedown: (evt: MouseEvent) => void;
  };
};

type Props = {
  handleReorder: (id: string, ordering: number) => void;
};

const DragAndDrop: React.FC<Props> = ({ handleReorder, children }) => {
  const elementsRef = useRef<elmRefs>({});

  const captureRef = (elm: HTMLDivElement, data: any) => {
    const { id } = data;
    if (elm) {
      const ref = (elementsRef.current[id] = {
        elm,
        data,
        mousedown: getMouseDown(id, elementsRef.current, handleReorder),
      });
      ref.elm.onmousedown = ref.mousedown;
    }
  };

  const clearRef = (id: string) => {
    delete elementsRef.current[id];
  };

  return <DNDProvider value={{ captureRef, clearRef }}>{children}</DNDProvider>;
};

export { DNDContext };
export default DragAndDrop;
