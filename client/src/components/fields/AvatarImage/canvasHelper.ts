const MAX_H = window.innerHeight * 0.6;
const MAX_W = window.innerWidth * 0.6;

type BorderKeys = "top" | "right" | "bottom" | "left" | "rect";

// Get paths object
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

  const arcPath = new Path2D();
  // get origin
  const [x1, y1] = [left, top];
  // get difference
  const [dx, dy] = [right - left, bottom - top];
  // get center point of corners
  const [cx, cy] = [x1 + dx / 2, y1 + dy / 2];
  // get radius
  const r = cx - x1;
  // construct circle path
  arcPath.arc(cx, cy, r, 0, 2 * Math.PI);

  return {
    top: topPath,
    left: leftPath,
    right: rightPath,
    bottom: bottomPath,
    rect: rectPath,
    arc: arcPath,
  };
};

export default (canvas: HTMLCanvasElement, img: HTMLImageElement) =>
  (evt: any) => {
    // Assign context and body (we use body to style the cursor)
    const ctx = canvas.getContext("2d");
    const body = document.querySelector("body");
    if (!ctx) {
      throw new Error("No canvas context was created");
    }
    if (!body) {
      throw new Error("No <body> was found in canvasHelper");
    }

    // Get height & width of image attached to img.onload((evt) => {...})
    const { height, width } = evt.path[0];

    // Assign a ratio to keep image a reasonable size for editing
    let ratio: number;
    if (MAX_W > MAX_H) {
      ratio = MAX_H / height;
    } else {
      ratio = MAX_W / width;
    }
    canvas.height = height * ratio;
    canvas.width = width * ratio;

    // Cropped result aspect ratio: width / height = aspect
    const aspect = 1;
    // Need shorter length or we potentially break check[border] functions
    let shorterLength =
      canvas.width > canvas.height ? canvas.height : canvas.width;
    // Borders (note: We use mutations & AvatarImage has a 1:1 aspect)
    let borders = {
      top: 0,
      left: 0,
      right: shorterLength,
      bottom: shorterLength,
    };
    console.log(borders);
    // Check functions to help keep borders within bounds
    // note: be wary of borders spawning out-of-bounds, check will always return false
    //       and move/scale functions won't work properly
    const check = {
      top: (y: number) => !(borders.top + y < 0),
      left: (x: number) => !(borders.left + x < 0),
      right: (x: number) => !(borders.right + x > canvas.width),
      bottom: (y: number) => !(borders.bottom + y > canvas.height),
    };

    // Reposition borders (while keeping within bounds)
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
    // Resize borders with fixed ratio (while keeping within bounds)
    const scaleBorders = (x: number, y: number, border: string) => {
      switch (border) {
        case "left": {
          if (check.left(x) && check.top(x / aspect)) {
            borders.left += x;
            borders.top += x / aspect;
          }
          break;
        }
        case "top": {
          if (check.top(y) && check.left(y * aspect)) {
            borders.top += y;
            borders.left += y * aspect;
          }
          break;
        }
        case "right": {
          if (check.right(x) && check.bottom(x / aspect)) {
            borders.right += x;
            borders.bottom += x / aspect;
          }
          break;
        }
        case "bottom": {
          if (check.bottom(y) && check.right(y * aspect)) {
            borders.bottom += y;
            borders.right += y * aspect;
          }
          break;
        }
        default: {
          throw new Error("default switch case");
        }
      }
      paths = getPath(borders);
    };

    // Change targetPath to highlight a border
    let targetPath: BorderKeys | null = null;
    // Change paths via getPaths(borders)
    let paths = getPath(borders);
    // Use isInPath to test if (x, y) is inside a border or the selected area
    const isInPath = (x: number, y: number): BorderKeys | null => {
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

    // Render function, editing = true will make this loop through requestAnimationFrame
    const redraw = (editing: boolean = true) => {
      // Reset canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (editing) {
        // Make outside area opaque
        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.rect(0, 0, canvas.width, borders.top);
        ctx.rect(0, 0, borders.left, canvas.height);
        ctx.rect(borders.right, 0, canvas.width, canvas.height);
        ctx.rect(0, borders.bottom, canvas.width, canvas.height);
        ctx.fill();

        // Draw arc (circle)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 1;
        ctx.stroke(paths.arc);

        // Draw Borders
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 4;
        for (let p of Object.values(paths)) {
          ctx.stroke(p);
        }
        if (targetPath !== null) {
          // Highlight targetPath
          ctx.strokeStyle = "rgba(0, 255, 0, 0.6)";
          ctx.stroke(paths[targetPath]);
        }

        // Assign to frame (we want to be able to escape the render loop)
        frame = window.requestAnimationFrame(() => redraw());
      } else {
        // Escape render loop
        cancelAnimationFrame(frame);
      }
    };

    // Restyles the event cursor (note: gets temporarily unassigned)
    const handleMouseMove = (evt: MouseEvent) => {
      const { offsetX, offsetY } = evt;
      targetPath = isInPath(offsetX, offsetY);

      if (targetPath !== null) {
        body.style.cursor = "pointer";
      } else {
        body.style.cursor = "default";
      }
    };

    // Allows for dragging
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

      // Assign and unassign different events
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

    // Inititialize events and render
    canvas.onmousemove = handleMouseMove;
    canvas.onmousedown = handleMouseDown;
    redraw();

    // Process images
    (canvas as any).getCroppedImage = () => {
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
      return canvas2.toBlob;
    };

    // *** Good for testing *** (returned dataURL works nicely with img.src)
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
