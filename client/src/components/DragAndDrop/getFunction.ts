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

    const currentTarget = refs[id].elm;
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
      console.log(f === currentTarget);
    }

    const MouseMove = (moveEvt: MouseEvent) => {
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

        for (let i = 0; i < refElms.length; i++) {
          const elm = refElms[i];
          const bb = elm.boundingBox;

          if (refsArr[i].elm !== currentTarget) {
            const isValidY =
              moveEvt.pageY > bb.top && moveEvt.pageY < bb.bottom;
            // Is Left
            if (
              isValidY &&
              moveEvt.pageX > bb.left - x2 &&
              moveEvt.pageX < bb.left + x2
            ) {
              isValidDrop = true;
              dropIndex = i;
              elm.parentNode!.insertBefore(separator, elm);
              currentTarget.style.display = "none";
              break;
            }

            // Is Right
            if (
              isValidY &&
              moveEvt.pageX > bb.right - x2 &&
              moveEvt.pageX < bb.right + x2
            ) {
              isValidDrop = true;
              dropIndex = i + 1;
              elm.parentNode!.insertBefore(separator, elm.nextSibling);
              currentTarget.style.display = "none";
              break;
            }
          }
        }
      }
    };

    const holdMouseTimeout = setTimeout(() => {
      window.addEventListener("mousemove", MouseMove);
    }, 125);
  };
