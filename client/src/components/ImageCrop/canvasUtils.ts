type Options = {
  aspect: number;
};

class HTMLCanavasCropElement {
  CTX?: CanvasRenderingContext2D | null;
  CANVAS?: HTMLCanvasElement;
  RANGE?: HTMLInputElement;
  IMAGE: HTMLImageElement;
  ASPECT: number;

  constructor(aspect: number) {
    this.ASPECT = aspect;
    this.IMAGE = new Image();
    this.IMAGE.onload = this.loadImage;
  }

  set range(elm: HTMLInputElement) {
    this.RANGE = elm;
  }

  get range() {
    if (this.RANGE) {
      return this.RANGE;
    } else {
      throw new Error("No range was initialized");
    }
  }

  set canvas(elm: HTMLCanvasElement) {
    this.CANVAS = elm;
    this.CTX = elm.getContext("2d");
  }

  get canvas() {
    if (this.CANVAS) {
      return this.CANVAS;
    } else {
      throw new Error("No canvas was initialized");
    }
  }

  get ctx() {
    if (this.CTX) {
      return this.CTX;
    } else {
      throw new Error("No context was initialized");
    }
  }

  get aspect() {
    return this.ASPECT;
  }

  get image() {
    if (this.IMAGE) {
      return this.IMAGE;
    } else {
      throw new Error("No image was loaded");
    }
  }

  loadFile(file: File) {
    this.image.src = URL.createObjectURL(file);
  }

  loadImage(evt: any) {
    const { canvas, image, aspect } = this;
    const { height, width } = evt.path[0];
    console.log(canvas, image, aspect);
    console.log(height, width);
  }
}

export default HTMLCanavasCropElement;
