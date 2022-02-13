type Options = {
  aspect: number;
  bound_h: number;
  bound_w: number;
  shape: "arc" | "rect";
};

export default class HTMLCanvasCropElement implements IHTMLCanvasCropElement {
  private CTX?: CanvasRenderingContext2D | null;
  private CANVAS?: HTMLCanvasElement;
  private RANGE?: HTMLInputElement;
  private BOUNDING_SCALE?: number;
  private FRAME?: any;
  private ORIGINAL_WIDTH?: number;
  private ORIGINAL_HEIGHT?: number;
  private ZOOM?: number;

  private aspect: number;
  private image: HTMLImageElement;
  private inX: number;
  private inY: number;
  private sx: number;
  private sy: number;
  private bound_w: number;
  private bound_h: number;
  private shape: string;

  private check: {
    top: (y: number) => boolean;
    left: (x: number) => boolean;
    right: (x: number) => boolean;
    bottom: (y: number) => boolean;
  };

  constructor({ aspect, bound_w, bound_h, shape }: Options) {
    this.aspect = aspect;
    this.image = new Image();
    this.image.onload = (evt) => this.loadImage.call(this, evt);
    this.inX = 0;
    this.inY = 0;
    this.sx = 0;
    this.sy = 0;
    this.frame = null;
    this.bound_h = window.innerHeight * bound_h;
    this.bound_w = window.innerWidth * bound_w;
    this.shape = shape;

    this.check = {
      top: (y: number) => this.inY + y > -this.sy,
      left: (x: number) => this.inX + x > -this.sx,
      right: (x: number) => this.inX + x < this.sx,
      bottom: (y: number) => this.inY + y < this.sy,
    };
  }

  set range(elm: HTMLInputElement) {
    this.RANGE = elm;
    this.RANGE.oninput = (evt) => this.handleRangeInput.call(this, evt);
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
    this.CANVAS.onmousedown = (evt) => this.handleMouseDown(evt);
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

  set boundingScale(n: number) {
    this.BOUNDING_SCALE = n;
  }

  get boundingScale() {
    if (this.BOUNDING_SCALE) {
      return this.BOUNDING_SCALE;
    } else {
      throw new Error("No bounding scale was initialized");
    }
  }

  set frame(a: any) {
    this.FRAME = a;
  }

  get frame() {
    if (this.FRAME) {
      return this.FRAME;
    } else {
      console.warn("No frame was initialized");
      return false;
    }
  }

  set originalWidth(n: number) {
    this.ORIGINAL_WIDTH = n;
  }

  get originalWidth() {
    if (this.ORIGINAL_WIDTH) {
      return this.ORIGINAL_WIDTH;
    } else {
      throw new Error("ORIGINAL_WIDTH was not initialized");
    }
  }

  set originalHeight(n: number) {
    this.ORIGINAL_HEIGHT = n;
  }

  get originalHeight() {
    if (this.ORIGINAL_HEIGHT) {
      return this.ORIGINAL_HEIGHT;
    } else {
      throw new Error("ORIGINAL_HEIGHT was not initialized");
    }
  }

  get shortSide() {
    return this.canvas.width < this.canvas.height
      ? this.canvas.width
      : this.canvas.height;
  }

  set zoom(n: number) {
    this.ZOOM = n + 1;
    // move this  stuff somewhere else
    let [px, py] = [0, 0];
    if (this.shape === "arc") {
      px = 0;
      py = 0;
    }
    if (this.shape === "rect") {
      if (this.aspect > 1) {
        py =
          ((this.originalHeight - this.originalHeight / this.aspect) / 2) *
          (1 / this.ZOOM);
      } else {
        px =
          ((this.originalWidth - this.originalWidth * this.aspect) / 2) *
          (1 / this.ZOOM);
      }
    }
    this.sx = px + (this.originalWidth - this.originalWidth / this.ZOOM) / 2;
    this.sy = py + (this.originalHeight - this.originalHeight / this.ZOOM) / 2;
    if (!this.check.top(0)) {
      this.inY = -this.sy;
    }
    if (!this.check.bottom(0)) {
      this.inY = this.sy;
    }
    if (!this.check.left(0)) {
      this.inX = -this.sx;
    }
    if (!this.check.right(0)) {
      this.inX = this.sx;
    }
  }

  get zoom() {
    if (this.ZOOM) {
      return this.ZOOM;
    } else {
      return 1;
    }
  }

  drawRectOpacity() {
    const { height, width } = this.canvas;
    const [cx, cy] = [width / 2, height / 2];

    if (this.aspect > 1) {
      const [px, py] = [width, height / this.aspect];
      this.ctx.beginPath();
      this.ctx.rect(0, cy - py / 2, px, py);
      this.ctx.rect(width, 0, -width, height);
    } else {
      const [px, py] = [width * this.aspect, height];
      this.ctx.beginPath();
      this.ctx.rect(cx - px / 2, 0, px, py);
      this.ctx.rect(width, 0, -width, height);
    }

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    this.ctx.fill();
  }

  getRectImageData() {
    this.canvas.width = this.originalWidth;
    this.canvas.height = this.originalHeight;
    const { height, width } = this.canvas;
    const { aspect } = this;
    this.ctx.drawImage(this.image, 0, 0, width, height);

    const [cx, cy] = [width / 2, height / 2];

    if (this.aspect > 1) {
      const [px, py] = [width, height / aspect];
      return this.ctx.getImageData(this.inX, this.inY + (cy - py / 2), px, py);
    } else {
      const [px, py] = [width * aspect, height];
      return this.ctx.getImageData(cx - px / 2, 0, px, py);
    }
  }

  drawArcOpacity() {
    const { height, width } = this.canvas;
    const [cx, cy] = [width / 2, height / 2];
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, this.shortSide / 2 - 10, 0, 2 * Math.PI);
    this.ctx.rect(width, 0, -width, height);
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    this.ctx.fill();
  }

  getArcImageData() {
    const { originalWidth, originalHeight, aspect } = this;

    const [cx, cy] = [originalWidth / 2, originalHeight / 2];

    if (this.aspect > 1) {
      const [px, py] = [originalWidth, originalHeight / aspect];
      return this.ctx.getImageData(0, cy - py / 2, px, py);
    } else {
      const [px, py] = [originalWidth * aspect, originalHeight];
      return this.ctx.getImageData(cx - px / 2, 0, px, py);
    }
  }

  render() {
    const { inX, inY, zoom, ctx, canvas, image } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const [zx, zy] = [this.originalWidth / zoom, this.originalHeight / zoom];
    ctx.beginPath();
    ctx.rect(
      -this.canvas.width,
      -this.canvas.height,
      this.canvas.width * 3,
      this.canvas.height * 3,
    );
    ctx.fillStyle = "rgba(25, 25, 25, 1)";
    ctx.fill();
    ctx.drawImage(
      image,
      inX + (this.originalWidth - zx) / 2,
      inY + (this.originalHeight - zy) / 2,
      zx,
      zy,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    switch (this.shape) {
      case "arc": {
        this.drawArcOpacity();
        break;
      }
      case "rect": {
        this.drawRectOpacity();
        break;
      }
      default: {
        throw new Error("Fallthrough on case this.shape = " + this.shape);
      }
    }

    this.frame = window.requestAnimationFrame(() => this.render());
  }
  clear() {
    if (this.FRAME) {
      cancelAnimationFrame(this.frame);
    }
    if (this.RANGE) {
      this.range.value = "0";
    }
    if (this.CANVAS) {
      this.canvas.height = 200;
      this.canvas.width = 200;
    }
    if (this.CTX) {
      this.ctx.clearRect(0, 0, 200, 200);
    }
  }

  loadFile(file: File) {
    this.image.onload = (evt) => this.loadImage.call(this, evt);
    this.image.src = URL.createObjectURL(file);
  }

  get body() {
    const body = document.querySelector("body");
    if (body) {
      return body;
    } else {
      throw new Error("No body was found");
    }
  }

  private loadImage(evt: any) {
    const { height, width } = evt.path[0];
    this.originalWidth = width;
    this.originalHeight = height;

    if (this.bound_w > this.bound_h) {
      this.boundingScale = this.bound_h / height;
    } else {
      this.boundingScale = this.bound_w / width;
    }
    this.canvas.height = height * this.boundingScale;
    this.canvas.width = width * this.boundingScale;
    this.zoom = 0;

    this.render();
  }

  handlePanImage(x: number, y: number) {
    const { check } = this;
    if (check.top(y) && check.bottom(y)) {
      this.inY += y;
    }
    if (check.right(x) && check.left(x)) {
      this.inX += x;
    }
  }

  handleRangeInput(evt: Event) {
    const target = evt.currentTarget as HTMLInputElement | undefined;
    if (target) {
      this.zoom = parseFloat(target.value);
    }
  }

  handleMouseDown(downevt: MouseEvent) {
    let subX = 0;
    let subY = 0;

    const handleMouseDrag = (dragevt: MouseEvent) => {
      this.body.style.cursor = "grabbing";
      const x1 = dragevt.pageX - downevt.pageX;
      const y1 = dragevt.pageY - downevt.pageY;
      const moveX = x1 - subX;
      const moveY = y1 - subY;

      subX = x1;
      subY = y1;

      this.handlePanImage(-moveX, -moveY);
    };

    // Assign and unassign different events
    const handleMouseUp = (_upevt: MouseEvent) => {
      this.body.style.cursor = "default";
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseDrag);
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseDrag);
  }

  getImageBlob(cb: BlobCallback, fileType: string, quality: number) {
    cancelAnimationFrame(this.frame);
    this.render();
    cancelAnimationFrame(this.frame);

    let imageData: ImageData;
    switch (this.shape) {
      case "arc": {
        imageData = this.getArcImageData();
        break;
      }
      case "rect": {
        imageData = this.getRectImageData();
        break;
      }
      default: {
        throw new Error("shape not found");
      }
    }

    const canvas2 = document.createElement("canvas");
    canvas2.width = imageData.width;
    canvas2.height = imageData.height;
    const ctx2 = canvas2.getContext("2d");
    if (ctx2 === null) {
      throw new Error("problem creating ctx2 in canvasHelper");
    }

    ctx2.putImageData(imageData, 0, 0);
    canvas2.toBlob(cb, fileType, quality);
  }

  getDataURL() {
    cancelAnimationFrame(this.frame);
    this.render();
    cancelAnimationFrame(this.frame);

    let imageData: ImageData;
    switch (this.shape) {
      case "arc": {
        imageData = this.getArcImageData();
        break;
      }
      case "rect": {
        imageData = this.getRectImageData();
        break;
      }
      default: {
        throw new Error("shape not found");
      }
    }

    const canvas2 = document.createElement("canvas");
    canvas2.width = imageData.width;
    canvas2.height = imageData.height;
    const ctx2 = canvas2.getContext("2d");
    if (ctx2 === null) {
      throw new Error("problem creating ctx2 in canvasHelper");
    }

    ctx2.putImageData(imageData, 0, 0);
    return canvas2.toDataURL("image/jpeg");
  }
}
