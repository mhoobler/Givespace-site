type ref = {
  elm: HTMLElement;
  data: any;
  mousedown: (evt: MouseEvent) => void;
};

type refsMap = {
  [key: string]: ref;
};

const px = (int: number): string => int + "px";

export const getMouseDown =
  (id: string, refs: refsMap, reorderLabel: any) => (downEvt: MouseEvent) => {
    const refsArr: ref[] = Object.values(refs).sort(
      (a, b) => a.data.ordering - b.data.ordering
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
    };

    window.addEventListener("mouseup", MouseUp);

    const MouseMove = (moveEvt: MouseEvent) => {
      append = root.appendChild(cloneTarget) as HTMLElement;
      append.style.width = px(targetBoundingBox.width);
      append.style.height = px(targetBoundingBox.height);
      append.style.position = "fixed";
      append.style.cursor = "grabbing";

      if (append) {
        const y2 = targetBoundingBox.width / 2;
        const x2 = targetBoundingBox.height / 2;
        append.style.top = px(moveEvt.pageY - x2);
        append.style.left = px(moveEvt.pageX - y2);
        separator.remove();
        isValidDrop = false;

        for (let i = 0; i < refsArr.length; i++) {
          const { elm } = refsArr[i];
          const bb = elm.getBoundingClientRect();

          // Is Left
          if (moveEvt.pageX > bb.left - 20 && moveEvt.pageX < bb.left + 20) {
            isValidDrop = true;
            dropIndex = i;
            elm.parentNode!.insertBefore(separator, elm);
            break;
          }

          // Is Right
          if (moveEvt.pageX > bb.right - 20 && moveEvt.pageX < bb.right + 20) {
            isValidDrop = true;
            dropIndex = i + 1;
            elm.parentNode!.insertBefore(separator, elm.nextSibling);
            break;
          }
        }
      }
    };

    const holdMouseTimeout = setTimeout(() => {
      window.addEventListener("mousemove", MouseMove);
    }, 125);
  };
