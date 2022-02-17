import React from "react";
import RefManager from "./RefManager";

import "./ImageCrop.less";

import { ZoomIn, ZoomOut } from "../../assets";

type Props = {};

const ImageCrop = React.forwardRef<ImageCrop.RefManager, Props>(
  (_props, ref) => {
    const handleRefs = (parent: HTMLDivElement | null) => {
      if (parent) {
        const canvas = parent.querySelector("canvas");
        const range = parent.querySelector("input");

        if (ref && canvas && range) {
          (ref as any).current.canvas = canvas;
          (ref as any).current.range = range;
        }
      }
    };

    return (
      <div
        className="d-flex flex-column image-crop"
        ref={(elm) => handleRefs(elm)}
      >
        <canvas></canvas>
        <div className="zoom-container">
          <div className="zoom-icon">
            <img src={ZoomIn} />
          </div>
          <input type="range" defaultValue={0} max={1} step={0.005} />
          <div className="zoom-icon">
            <img src={ZoomOut} />
          </div>
        </div>
      </div>
    );
  },
);

export default Object.assign(ImageCrop, { RefManager });
