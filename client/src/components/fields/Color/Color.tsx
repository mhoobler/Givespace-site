import React, { useRef } from "react";
import { IconButton } from "../..";
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

  const handleBlur = () => {
    if (colorInput.current?.value) {
      handleSubmit(colorInput.current?.value);
    }
  };

  return (
    <div>
      <IconButton onClick={handleToggle} src={Palette} />
      <div className="color-picker-container">
        <input
          className="color-picker-input"
          ref={colorInput}
          type="color"
          value={color}
          onChange={() => handleChange(colorInput.current?.value || "#ffffff")}
          onBlur={handleBlur}
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
