import React, { useRef } from "react";
import { Palette } from "../../../assets";

import "./Color.less";
import { useEffect } from "react";

type Props = {
  color: string;
  handleChange: (color: string) => void;
  handleSubmit: (color: string) => void;
};
const Color = ({ color, handleChange, handleSubmit }: Props) => {
  const colorInput = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    // on toggle click on colorInput
    colorInput.current?.click();
  };

  useEffect(() => {
    colorInput.current?.addEventListener("change", () => {
      handleSubmit(colorInput.current?.value || "#ffffff");
    });
  }, [colorInput]);

  return (
    <div>
      <div
        onClick={handleToggle}
        className="icon-btn"
        style={{ backgroundColor: color }}
      >
        <img src={Palette} alt="" />
      </div>
      <div className="color-picker-container">
        <input
          className="color-picker-input"
          ref={colorInput}
          type="color"
          value={color}
          onChange={() => handleChange(colorInput.current?.value || "#ffffff")}
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
