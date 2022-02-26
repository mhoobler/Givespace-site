namespace DragHelper {
  export type handleReorder = (id: string, ordering: number) => void;
  export type refs = {
    [key: string]: DragRef;
  };
  export type refsArr = DragRef[];
  export type timeout = ReturnType<typeof setTimeout>;
}

class DragRef {
  elm: HTMLDivElement;
  data: any;
  drag: DragHelper;
  private bb?: DOMRect;

  constructor(elm: HTMLDivElement, data: any, drag: DragHelper) {
    this.elm = elm;
    this.data = data;
    this.drag = drag;
  }

  get boundingBox() {
    if (this.bb) {
      return this.bb;
    } else {
      throw new Error("no bounding box assigned");
    }
  }

  set boundingBox(rect: DOMRect) {
    this.bb = rect;
  }
}

class DragHelper {
  private DRAG_TIMEOUT?: DragHelper.timeout;
  private DRAG_ELM?: HTMLDivElement;
  private TARGET?: HTMLDivElement;
  private CHILD?: HTMLDivElement;
  private SIBLING?: HTMLDivElement;
  private PARENT?: HTMLDivElement;

  private handleReorder: DragHelper.handleReorder;
  private refs: DragHelper.refs;
  private refsArr: DragHelper.refsArr;
  private keys: Set<string>;
  private validDrop: boolean;
  private validX: boolean;
  private validY: boolean;
  private dragStart: boolean;
  private orderingPrev: number;
  private orderingNext: number;
  disabled: boolean;

  constructor(handleReorder: DragHelper.handleReorder) {
    this.handleReorder = handleReorder;
    this.refs = {};
    this.refsArr = [];
    this.keys = new Set();
    this.validDrop = false;
    this.validX = false;
    this.validY = false;
    this.dragStart = false;
    this.orderingPrev = 0;
    this.orderingNext = 0;
    this.disabled = false;
  }

  get root() {
    const r = document.getElementById("root");
    if (r) {
      return r;
    } else {
      throw new Error("No root");
    }
  }

  get dragTimeout() {
    if (this.DRAG_TIMEOUT) {
      return this.DRAG_TIMEOUT;
    } else {
      throw new Error("No dragTimeout");
    }
  }

  set dragTimeout(timeout: DragHelper.timeout) {
    this.DRAG_TIMEOUT = timeout;
  }

  get target(): HTMLDivElement {
    if (this.TARGET) {
      return this.TARGET;
    } else {
      throw new Error("No target");
    }
  }

  set target(elm: HTMLDivElement | undefined) {
    this.TARGET = elm;
  }

  get child(): HTMLDivElement {
    if (this.CHILD) {
      return this.CHILD;
    } else {
      throw new Error("No child");
    }
  }

  set child(elm: HTMLDivElement | undefined) {
    this.CHILD = elm;
  }

  get dragElm(): HTMLDivElement {
    if (this.DRAG_ELM) {
      return this.DRAG_ELM;
    } else {
      throw new Error("No dragElm");
    }
  }

  set dragElm(elm: HTMLDivElement | undefined) {
    this.DRAG_ELM = elm;
  }

  get sibling(): HTMLDivElement | undefined {
    return this.SIBLING;
  }

  set sibling(elm: HTMLDivElement | undefined) {
    this.SIBLING = elm;
  }

  get parent(): HTMLDivElement {
    if (this.PARENT) {
      return this.PARENT;
    } else {
      throw new Error("No parent");
    }
  }

  set parent(elm: HTMLDivElement | undefined) {
    this.PARENT = elm;
  }

  captureRef(elm: HTMLDivElement, data: any) {
    if (elm) {
      elm.onmousedown = this.disabled
        ? null
        : (evt) => this.handleMouseDown.call(this, evt, data);
      if (!this.keys.has(data.id)) {
        const ref = new DragRef(elm, data, this);

        this.keys.add(data.id);
        this.refs[data.id] = ref;
        this.refsArr.push(ref);
      }
    }
  }

  clearRef(id: string) {
    if (this.keys.has(id)) {
      this.keys.delete(id);
    }
    delete this.refs[id];
    this.refsArr.filter((e) => e.data.id !== id);
  }

  prepRefs() {
    for (let ref of this.refsArr) {
      ref.boundingBox = ref.elm.getBoundingClientRect();
    }
    this.refsArr.forEach(
      (e) => (e.boundingBox = e.elm.getBoundingClientRect()),
    );
  }

  prepTarget(target: EventTarget) {
    this.target = target as HTMLDivElement;
    this.target.style.opacity = "0.6";
    this.sibling = this.target.nextSibling as HTMLDivElement;
    this.parent = this.target.parentElement as HTMLDivElement;

    const clone = this.root.appendChild(this.target.cloneNode(true));
    this.dragElm = clone as HTMLDivElement;
    const { width, height } = this.target.getBoundingClientRect();
    this.dragElm.style.width = width + "px";
    this.dragElm.style.height = height + "px";
    this.dragElm.style.position = "fixed";
    this.root.style.cursor = "grabbing";
    this.dragElm.style.zIndex = "999";

    this.child = this.target.firstElementChild as HTMLDivElement;
    this.child.style.boxShadow = "0 0 10px #D95F78";
  }

  clearTarget() {
    this.dragElm.remove();
    this.target.style.opacity = "";
    this.child.style.boxShadow = "";
    this.root.style.cursor = "";
    this.target = undefined;
    this.sibling = undefined;
    this.parent = undefined;
    this.dragElm = undefined;
  }

  handleMouseDown(downEvt: MouseEvent, data: any) {
    this.dragTimeout = setTimeout(() => {
      this.prepRefs();
      this.prepTarget(this.refs[data.id].elm);

      window.onmousemove = (evt) => this.handleMouseMove.call(this, evt, data);
      this.dragStart = true;
    }, 200);
    window.onmouseup = (evt) => this.handleMouseUp.call(this, evt, data);
  }

  handleMouseMove(moveEvt: MouseEvent, data: any) {
    const { pageX, pageY } = moveEvt;
    const targetHeight = this.refs[data.id].boundingBox.height;
    const targetWidth = this.refs[data.id].boundingBox.width;
    this.dragElm.style.top = pageY - targetHeight / 2 - window.scrollY + "px";
    this.dragElm.style.left = pageX - targetWidth / 2 - window.scrollX + "px";

    for (let i = 0; i < this.refsArr.length; i++) {
      const ref = this.refsArr[i];
      const { top, left, right, bottom, width } = ref.boundingBox;
      const x2 = width / 2;
      const [mx, my] = [pageX - window.scrollX, pageY - window.scrollY];

      const validY = my > top && my < bottom;
      const isLeft = mx > left - x2 && mx < left + x2;
      const isRight = mx > right - x2 && mx < right + x2;

      this.validY = validY;
      this.validX = isLeft || isRight;
      this.validDrop = this.validX && this.validY;

      if (this.validDrop) {
        if (isLeft) {
          this.orderingPrev =
            this.refsArr[i - 1] && this.refsArr[i - 1].data.ordering;
          this.orderingNext = ref.data.ordering;
          this.parent.insertBefore(this.target, ref.elm);
          break;
        } else {
          this.orderingPrev = ref.data.ordering;
          this.orderingNext =
            this.refsArr[i + 1] && this.refsArr[i + 1].data.ordering;
          this.parent.insertBefore(this.target, ref.elm.nextSibling);
          break;
        }
      } else {
        if (this.sibling) {
          this.parent.insertBefore(this.target, this.sibling);
        } else {
          this.parent.appendChild(this.target);
        }
      }

      //const isLeft = pageX > left;
      //const isRight = pageX < right;
      //const isTop = pageY > top;
      //const isBottom = pageY < bottom;

      //if (isLeft && isRight && isTop && isBottom) {
      //  ref.elm.style.border = "2px solid red";
      //} else {
      //  ref.elm.style.border = "";
      //}
    }
  }

  handleMouseUp(upEvt: MouseEvent, data: any) {
    clearTimeout(this.dragTimeout);
    if (this.dragStart) {
      this.clearTarget();
      this.dragStart = false;

      if (this.orderingPrev !== undefined && this.orderingNext !== undefined) {
        this.handleReorder(
          data.id,
          (this.orderingPrev + this.orderingNext) / 2,
        );
      } else if (this.orderingNext === undefined) {
        this.handleReorder(data.id, this.orderingPrev + 1);
      } else if (this.orderingPrev === undefined) {
        this.handleReorder(data.id, this.orderingNext - 1);
      } else {
        console.warn("fallthrough case in DragHelper.handleMouseUp");
      }
    }
    window.onmousemove = null;
    window.onmouseup = null;
  }
}

export default DragHelper;
