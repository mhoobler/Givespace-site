declare interface IHTMLCanvasCropElement {
  // Getters setters
  range: HTMLInputElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  boundingScale: number;
  frame: DOMHighResTimeStamp;

  render: () => void;
  loadFile: (file: File) => void;

  //loadImage: (evt: any) => void;
}
