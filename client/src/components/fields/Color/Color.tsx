import React, { useRef } from "react";
import { Palette } from "../../../assets";

import "./Color.less";

type Props = {
  color: string;
  handleChange: (color: string) => void;
  handleSubmit: (color: string) => void;
};
const Color = ({ color, handleChange, handleSubmit }: Props) => {
  const colorInput = useRef<HTMLInputElement>();

  const handleToggle = () => {
    // on toggle click on colorInput
    colorInput.current?.click();
    colorInput.current?.focus();
  };

  return (
    <div>
      <div
        onClick={handleToggle}
        className="icon-btn"
        // this style change is only a proof of concept
        style={{ backgroundColor: color }}
      >
        <img src={Palette} alt="" />
      </div>
      <div className="color-picker-container">
        <input
          className="color-picker-input"
          // @ts-ignore
          ref={colorInput}
          type="color"
          value={color}
          onBlur={(e) => {
            handleSubmit(e.target.value || "#ff0000");
          }}
          onChange={(e) => {
            handleChange(e.target.value || "#ff0000");
          }}
        />
        {/* <SketchPicker
          color={color}
          onChangeComplete={(color) => setColor(color.hex)}
        /> */}
      </div>
    </div>
  );
};

export default Color;
