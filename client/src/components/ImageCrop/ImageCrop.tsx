import React from "react";
import HTMLCanvasCropElement from "./canvasUtils";

type Props2 = React.PropsWithChildren<{
  testProp: string;
}>;

const ImageCrop = React.forwardRef<HTMLCanvasCropElement, Props2>(
  (_props, ref) => {
    const handleRefs = (parent: HTMLDivElement | null) => {
      if (parent) {
        const canvas = parent.querySelector("canvas");
        const range = parent.querySelector("input");

        if (ref && canvas && range) {
          (ref as any).current.canvas = canvas;
          (ref as any).current.range = range;
        }
        console.log(ref);
      }
    };

    return (
      <div className="d-flex flex-column" ref={(elm) => handleRefs(elm)}>
        <canvas></canvas>
        <input type="range" defaultValue={0} max={1} step={0.005} />
      </div>
    );
  },
);

export default ImageCrop;
