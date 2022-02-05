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
      right: canvas.width,
      bottom: canvas.width / 4,
    };
    const moveBorders = (x: number, y: number) => {
      borders.top += y;
      borders.bottom += y;
      borders.left += x;
      borders.right += x;
      paths = getPath(borders);
    };
    const scaleBorders = (x: number, y: number, border: string) => {
      switch (border) {
        case "left": {
          borders.left += x;
          borders.top += x / 4;
          break;
        }
        case "top": {
          borders.top += y;
          borders.left += y * 4;
          break;
        }
        case "right": {
          borders.right += x;
          borders.bottom += x / 4;
          break;
        }
        case "bottom": {
          borders.bottom += y;
          borders.right += y * 4;
          break;
        }
        default: {
          throw new Error("default switch case");
        }
      }
      paths = getPath(borders);
    };

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

    const redraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 4;
      for (let p of Object.values(paths)) {
        ctx.stroke(p);
      }

      ctx.beginPath();
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.rect(0, 0, canvas.width, borders.top);
      ctx.rect(0, 0, borders.left, canvas.height);
      ctx.rect(borders.right, 0, canvas.width, canvas.height);
      ctx.rect(0, borders.bottom, canvas.width, canvas.height);
      ctx.fill();
    };

    const handleMouseMove = (evt: MouseEvent) => {
      const { offsetX, offsetY } = evt;
      const targetPath = isInPath(offsetX, offsetY);

      if (targetPath !== null) {
        body.style.cursor = "pointer";
        for (let p of Object.values(paths)) {
          if (p === paths[targetPath]) {
            ctx.strokeStyle = "rgba(0, 255, 0, 0.6)";
            ctx.stroke(p);
          }
        }
      } else {
        body.style.cursor = "default";
      }
    };

    const handleMouseDown = (downevt: MouseEvent) => {
      const { offsetX, offsetY } = downevt;
      const targetPath = isInPath(offsetX, offsetY) || "";
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
        } else {
          scaleBorders(moveX, moveY, targetPath);
        }

        for (let p of Object.values(paths)) {
          if (targetPath !== "" && p === paths[targetPath]) {
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

      if (Object.keys(paths).includes(targetPath)) {
        canvas.onmousemove = null;
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleMouseDrag);
      }
    };

    canvas.onmousemove = handleMouseMove;
    canvas.onmousedown = handleMouseDown;
    window.requestAnimationFrame(redraw);
  };
