type asf = {
  elm: HTMLElement;
  mousedown: (evt: MouseEvent) => void;
};

type elmRefs = {
  [key: string]: asf;
};

const px = (int: number): string => int + "px";

export const getMouseDown =
  (id: string, refs: elmRefs) => (evt: MouseEvent) => {
    const currentTarget = refs[id].elm;
    const targetBoundingBox = currentTarget.getBoundingClientRect();
    const cloneTarget = currentTarget.cloneNode(true);
    let append: HTMLElement;

    const root = document.getElementById("root");
    if (!root) {
      throw new Error("No root found");
    }

    const refElms = Object.values(refs).map(({ elm }) => elm);

    const separator = document.createElement("div");
    separator.style.width = "4px";
    separator.style.backgroundColor = "red";
    let isValidDrop = false;
    let dropIndex = refElms.findIndex((elm) => elm === currentTarget);
    console.log(dropIndex);

    const holdMouseTimeout = setTimeout(() => {
      window.addEventListener("mouseup", MouseUp);
      window.addEventListener("mousemove", MouseMove);
    }, 250);

    const MouseUp = (evt: MouseEvent) => {
      clearTimeout(holdMouseTimeout);
      window.removeEventListener("mouseup", MouseUp);
      window.removeEventListener("mousemove", MouseMove);
      if (separator && append) {
        separator.remove();
        append.remove();
      }
    };

    const MouseMove = (evt: MouseEvent) => {
      append = root.appendChild(cloneTarget) as HTMLElement;
      append.style.width = px(targetBoundingBox.width);
      append.style.height = px(targetBoundingBox.height);
      append.style.position = "fixed";
      append.style.cursor = "grabbing";

      if (append) {
        const y2 = targetBoundingBox.width / 2;
        const x2 = targetBoundingBox.height / 2;
        append.style.top = px(evt.pageY - x2);
        append.style.left = px(evt.pageX - y2);
        separator.remove();
        isValidDrop = false;

        for (let i = 0; i < refElms.length; i++) {
          const elm = refElms[i];
          const bb = elm.getBoundingClientRect();
          // Is Left
          if (evt.pageX > bb.left - 20 && evt.pageX < bb.left + 20) {
            isValidDrop = true;
            elm.parentNode!.insertBefore(separator, elm);
            console.log("is left of:", elm);
            break;
          }
          // Is Right

          if (evt.pageX > bb.right - 20 && evt.pageX < bb.right + 20) {
            isValidDrop = true;
            elm.parentNode!.insertBefore(separator, elm.nextSibling);
            console.log("is right of:", elm);
            break;
          }
        }
      }
    };
  };
