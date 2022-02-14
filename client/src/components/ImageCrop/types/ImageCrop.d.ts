declare namespace ImageCrop {
  export class RefManager {
    protected CTX?: CanvasRenderingContext2D;
    protected CANVAS?: HTMLCanvasElement;
    protected RANGE?: HTMLInputElement;
    protected BOUNDING_SCALE?: number;
    protected FRAME?: any;
    protected ORIGINAL_WIDTH?: number;
    protected ORIGINAL_HEIGHT?: number;
    protected ZOOM?: number;

    protected aspect: number;
    protected image: HTMLImageElement;
    protected inX: number;
    protected inY: number;
    protected sx: number;
    protected sy: number;
    protected bound_w: number;
    protected bound_h: number;
    protected shape: string;

    protected check: {
      top: (y: number) => boolean;
      left: (x: number) => boolean;
      right: (x: number) => boolean;
      bottom: (y: number) => boolean;
    };

    constructor(options: Options);

    // Getters and Setters
    set range(elm: HTMLInputElement);
    get range(): HTMLInputElement;

    set canvas(c: HTMLCanvasElement);
    get canvas(): HTMLCanvasElement;

    set boundingScale(n: number);
    get boundingScale(): number;

    // animation frame (used start and stop rendering loop)
    set frame(f: any);
    get frame(): any;

    // Dimensions of original image in pixels
    set originalWidth(n: number);
    get originalHeight(): number;
    set originalHeight(n: number);
    get originalHeight(): number;

    set zoom(n: number);
    get zoom(): number;

    get body(): HTMLBodyElement;
    get shortSide(): number;
    get ctx(): CanvasRenderingContext2D;

    // rendering helpers
    drawRectOpacity(): void;
    getRectImageData(): void;
    drawArcOpacity(): void;
    getArcImageData(): void;

    // starts rendering loop
    render(): void;
    // clears DOM elements and stops rendering loop
    clear(): void;

    // loaders
    loadFile(file: File): void;
    loadImage(evt: Event): void;

    // event handlers
    handlePanImage(x: number, y: number): void;
    handleRangeInput(evt: Event): void;
    handleMouseDown(downevt: MouseEvent): void;

    // output
    getImageBlob(cb: BlobCallback, fileType: string, quality: number): void;
    getDataURL(): any;
  }
}
