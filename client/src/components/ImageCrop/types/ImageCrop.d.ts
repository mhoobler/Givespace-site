class HTMLCanavasCropElement2 extends HTMLCanvasElement {
  ctx: CanvasRenderingContext2D | null;
  canvas: CanvasElement | null;
  range: HTMLInputElement | null;

  loadImage: (
    canvas: HTMLCanavasCropElement,
    img: HTMLImageElement,
  ) => HTMLCanavasCropElement;

  getCroppedImage: (
    cb: BlobCallback,
    fileType: string,
    quality: number,
  ) => void;

  getDataUrl: () => string;
}

declare type ImageCropRef = {
  canvas: HTMLCanavasCropElement | null;
  range: HTMLInputElement | null;
};
