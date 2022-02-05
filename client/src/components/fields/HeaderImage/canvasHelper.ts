const MAX_H = window.innerHeight * 0.3;
const MAX_W = window.innerWidth * 0.6;

const getPath = (borders: any) => {
  const { top, left, right, bottom } = borders;
  const bottomPath = new Path2D();
  bottomPath.moveTo(left, bottom);
  bottomPath.lineTo(right, bottom);
  bottomPath.closePath();

  const topPath = new Path2D();
  topPath.moveTo(left, top);
  topPath.lineTo(right, top);
  topPath.closePath();

  const leftPath = new Path2D();
  leftPath.moveTo(left, top);
  leftPath.lineTo(left, bottom);
  leftPath.closePath();

  const rightPath = new Path2D();
  rightPath.moveTo(right, top);
  rightPath.lineTo(right, bottom);
  rightPath.closePath();

  const rectPath = new Path2D();
  rectPath.rect(left, top, right - left, bottom - top);
  rectPath.closePath();

  return {
    top: topPath,
    left: leftPath,
    right: rightPath,
    bottom: bottomPath,
    rect: rectPath,
  };
};

export default (canvas: HTMLCanvasElement, img: HTMLImageElement) =>
  (evt: any) => {
    const ctx = canvas.getContext("2d");
    const body = document.querySelector("body");
    if (!ctx) {
      throw new Error("No canvas context was created");
    }
    if (!body) {
      throw new Error("No <body> was found in canvasHelper");
    }

    // is used evt.path because of the img.onload event
    const { height, width } = evt.path[0];
    let ratio: number;

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
      right: canvas.width,
      bottom: canvas.width / 4,
    };
    //@ts-ignore
    const check = {
      top: (y: number) => !(borders.top + y < 0),
      left: (x: number) => !(borders.left + x < 0),
      right: (x: number) => !(borders.right + x > canvas.width),
      bottom: (y: number) => !(borders.bottom + y > canvas.height),
    };

    const moveBorders = (x: number, y: number) => {
      if (check.top(y) && check.bottom(y)) {
        borders.top += y;
        borders.bottom += y;
      }
      if (check.right(x) && check.left(x)) {
        borders.left += x;
        borders.right += x;
      }
      paths = getPath(borders);
    };
    const scaleBorders = (x: number, y: number, border: string) => {
      switch (border) {
        case "left": {
          if (check.left(x) && check.top(x / 4)) {
            borders.left += x;
            borders.top += x / 4;
          }
          break;
        }
        case "top": {
          if (check.top(y) && check.left(y * 4)) {
            borders.top += y;
            borders.left += y * 4;
          }
          break;
        }
        case "right": {
          if (check.right(x) && check.bottom(x / 4)) {
            borders.right += x;
            borders.bottom += x / 4;
          }
          break;
        }
        case "bottom": {
          if (check.bottom(y) && check.right(y * 4)) {
            borders.bottom += y;
            borders.right += y * 4;
          }
          break;
        }
        default: {
          throw new Error("default switch case");
        }
      }
      paths = getPath(borders);
    };

    let targetPath: "top" | "right" | "bottom" | "left" | "rect" | null = null;
    let paths = getPath(borders);
    const isInPath = (x: number, y: number) => {
      const inTop = ctx.isPointInStroke(paths.top, x, y);
      const inLeft = ctx.isPointInStroke(paths.left, x, y);
      const inRight = ctx.isPointInStroke(paths.right, x, y);
      const inBottom = ctx.isPointInStroke(paths.bottom, x, y);
      const inRect = ctx.isPointInPath(paths.rect, x, y);

      if (inTop) {
        return "top";
      }
      if (inLeft) {
        return "left";
      }
      if (inRight) {
        return "right";
      }
      if (inBottom) {
        return "bottom";
      }
      if (inRect) {
        return "rect";
      }
      return null;
    };

    let frame: any;

    const redraw = (editing: boolean = true) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (editing) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.rect(0, 0, canvas.width, borders.top);
        ctx.rect(0, 0, borders.left, canvas.height);
        ctx.rect(borders.right, 0, canvas.width, canvas.height);
        ctx.rect(0, borders.bottom, canvas.width, canvas.height);
        ctx.fill();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 4;
        for (let p of Object.values(paths)) {
          ctx.stroke(p);
        }
        if (targetPath !== null) {
          ctx.strokeStyle = "rgba(0, 255, 0, 0.6)";
          ctx.stroke(paths[targetPath]);
        }
        frame = window.requestAnimationFrame(() => redraw());
      } else {
        cancelAnimationFrame(frame);
      }
    };

    const handleMouseMove = (evt: MouseEvent) => {
      const { offsetX, offsetY } = evt;
      targetPath = isInPath(offsetX, offsetY);

      if (targetPath !== null) {
        body.style.cursor = "pointer";
      } else {
        body.style.cursor = "default";
      }
    };

    const handleMouseDown = (downevt: MouseEvent) => {
      const { offsetX, offsetY } = downevt;
      targetPath = isInPath(offsetX, offsetY);
      let subX = 0;
      let subY = 0;

      const handleMouseDrag = (dragevt: MouseEvent) => {
        body.style.cursor = "grabbing";
        const x1 = dragevt.pageX - downevt.pageX;
        const y1 = dragevt.pageY - downevt.pageY;
        const moveX = x1 - subX;
        const moveY = y1 - subY;

        subX = x1;
        subY = y1;

        if (targetPath === "rect") {
          moveBorders(moveX, moveY);
        } else if (targetPath !== null) {
          scaleBorders(moveX, moveY, targetPath);
        }

        for (let p of Object.values(paths)) {
          if (targetPath !== null && p === paths[targetPath]) {
            ctx.strokeStyle = "rgba(0, 255, 0, 0.6)";
            ctx.stroke(p);
          }
        }
      };

      const handleMouseUp = (_upevt: MouseEvent) => {
        body.style.cursor = "default";
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("mousemove", handleMouseDrag);
        canvas.onmousemove = handleMouseMove;
      };

      if (targetPath !== null && Object.keys(paths).includes(targetPath)) {
        canvas.onmousemove = null;
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleMouseDrag);
      }
    };

    canvas.onmousemove = handleMouseMove;
    canvas.onmousedown = handleMouseDown;

    redraw();

    (canvas as any).getCroppedImage = (cb: any) => {
      const { top, left, bottom, right } = borders;
      redraw(false);
      canvas.height = evt.path[0].height;
      canvas.width = evt.path[0].width;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(
        left / ratio,
        top / ratio,
        (right - left) / ratio,
        (bottom - top) / ratio,
      );

      const canvas2 = document.createElement("canvas");
      canvas2.width = imageData.width;
      canvas2.height = imageData.height;
      const ctx2 = canvas2.getContext("2d");
      if (ctx2 === null) {
        throw new Error("problem creating ctx2 in canvasHelper");
      }

      ctx2.putImageData(imageData, 0, 0);
      return canvas2.toBlob(cb, "image/jpeg", 0.9);
    };

    // For testing
    (canvas as any).getDataURL = () => {
      const { top, left, bottom, right } = borders;
      redraw(false);
      canvas.height = evt.path[0].height;
      canvas.width = evt.path[0].width;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(
        left / ratio,
        top / ratio,
        (right - left) / ratio,
        (bottom - top) / ratio,
      );

      const canvas2 = document.createElement("canvas");
      canvas2.width = imageData.width;
      canvas2.height = imageData.height;
      const ctx2 = canvas2.getContext("2d");
      if (ctx2 === null) {
        throw new Error("problem creating ctx2 in canvasHelper");
      }

      ctx2.putImageData(imageData, 0, 0);
      return canvas2.toDataURL("image/jpeg");
    };
  };
