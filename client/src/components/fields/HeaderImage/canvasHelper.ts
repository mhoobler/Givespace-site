const MAX_H = window.innerHeight * 0.3;
const MAX_W = window.innerWidth * 0.6;

const getPath = (borders: any) => {
  const { top, left, right, bottom } = borders;
  const rectPath = new Path2D();
  rectPath.rect(left, top, right, bottom);
  rectPath.closePath();
  return rectPath;
};

export default (canvas: HTMLCanvasElement, img: HTMLImageElement) =>
  (evt: any) => {
    console.log(evt);
    const ctx = canvas.getContext("2d");
    const body = document.querySelector("body");
    if (!ctx) {
      throw new Error("No canvas context was created");
    }
    if (!body) {
      throw new Error("No <body> was found in canvasHelper");
    }

    const { height, width } = evt.path[0];
    let ratio;

    if (MAX_W > MAX_H) {
      ratio = MAX_H / height;
    } else {
      ratio = MAX_W / width;
    }
    canvas.height = height * ratio;
    canvas.width = width * ratio;

    let borders = {
      top: 0,
      left: 0,
      right: 400,
      bottom: 100,
    };
    let rectPath = getPath(borders);

    const redraw = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 4;
      ctx.stroke(rectPath);

      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.rect(0, 0, canvas.width, borders.top);
      ctx.rect(0, 0, borders.left, canvas.height);
      ctx.rect(borders.right, 0, canvas.width, canvas.height);
      ctx.rect(0, borders.bottom, canvas.width, canvas.height);
      ctx.fill();
    };

    redraw();

    canvas.onmousemove = (evt: MouseEvent) => {
      const { offsetX, offsetY } = evt;

      const inPath = ctx.isPointInStroke(rectPath, offsetX, offsetY);
      if (inPath) {
        body.style.cursor = "pointer";
      } else {
        body.style.cursor = "default";
      }
      console.log(inPath);
    };

    const handleMouseDown = (evt: MouseEvent) => {
      console.log(evt);
    };
  };
