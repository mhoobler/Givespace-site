type ref = {
  elm: HTMLDivElement;
  data: any;
  mousedown: (evt: MouseEvent) => void;
};

type refsMap = {
  [key: string]: ref;
};

const px = (int: number): string => int + "px";

interface ExtraElm extends HTMLDivElement {
  boundingBox?: any;
}

export const getMouseDown =
  (id: string, refs: refsMap, reorderLabel: any) => (downEvt: MouseEvent) => {
    const refsArr: ref[] = Object.values(refs).sort(
      (a, b) => a.data.ordering - b.data.ordering,
    );
    console.log("down");

    const currentTarget = refs[id].elm;
    const currentParent = currentTarget.parentElement;
    const currentSibling = currentTarget.nextSibling;
    const targetBoundingBox = currentTarget.getBoundingClientRect();
    const cloneTarget = currentTarget.cloneNode(true);
    let append: HTMLElement;

    const root = document.getElementById("root");
    if (!root) {
      throw new Error("No root found");
    }

    const separator = document.createElement("div");
    separator.style.width = "4px";
    separator.style.backgroundColor = "red";
    let isValidDrop = false;
    let dropIndex = refsArr.findIndex((ref) => ref.elm === currentTarget);

    const MouseUp = (upEvt: MouseEvent) => {
      console.log("up");
      clearTimeout(holdMouseTimeout);
      window.removeEventListener("mouseup", MouseUp);
      window.removeEventListener("mousemove", MouseMove);
      if (separator && append) {
        separator.remove();
        append.remove();
      }
      if (isValidDrop) {
        reorderLabel(id, dropIndex);
      }
      currentParent!.insertBefore(currentTarget, currentSibling);
      currentTarget.style.opacity = "";
      currentTarget.style.display = "";
    };

    window.addEventListener("mouseup", MouseUp);

    const refElms: ExtraElm[] = Object.values(refsArr).map((e: ref) => {
      const extra: ExtraElm = e.elm;
      extra.boundingBox = e.elm.getBoundingClientRect();
      return extra;
    });

    for (let f of refElms) {
      console.log(f.boundingBox);
    }

    const MouseMove = (moveEvt: MouseEvent) => {
      console.log("move");
      append = root.appendChild(cloneTarget) as HTMLElement;
      append.style.width = px(targetBoundingBox.width);
      append.style.height = px(targetBoundingBox.height);
      append.style.position = "fixed";
      append.style.cursor = "grabbing";
      append.style.zIndex = "999";
      currentTarget.style.opacity = "0.6";

      if (append) {
        const y2 = targetBoundingBox.width / 2;
        const x2 = targetBoundingBox.height / 2;
        append.style.top = px(moveEvt.pageY - y2 - window.scrollY);
        append.style.left = px(moveEvt.pageX - x2 - window.scrollX);
        separator.remove();
        isValidDrop = false;
        const [mx, my] = [
          moveEvt.pageX - window.scrollX,
          moveEvt.pageY - window.scrollY,
        ];

        for (let i = 0; i < refElms.length; i++) {
          const elm = refElms[i];
          const bb = elm.boundingBox;

          if (refsArr[i].elm !== currentTarget) {
            const isValidY = my > bb.top && my < bb.bottom;
            // Is Left
            if (isValidY && mx > bb.left - x2 && mx < bb.left + x2) {
              console.log(isValidY, true, false);
              isValidDrop = true;
              dropIndex = i;
              elm.parentNode!.insertBefore(separator, elm);
              currentTarget.remove();
              break;
            }

            // Is Right
            if (isValidY && mx > bb.right - x2 && mx < bb.right + x2) {
              console.log(isValidY, false, true);
              isValidDrop = true;
              dropIndex = i + 1;
              elm.parentNode!.insertBefore(separator, elm.nextSibling);
              currentTarget.remove();
              break;
            }
            console.log(isValidY, false, false);
          }
        }
      }
    };

    const holdMouseTimeout = setTimeout(() => {
      window.addEventListener("mousemove", MouseMove);
    }, 125);
  };
