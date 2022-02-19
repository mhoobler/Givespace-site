import React, { useRef } from "react";
import { IconButton } from "../..";
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
    // make colorInput's color swatch visible with IconButton onClick
    colorInput.current?.click();
  };

  const onChange = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    const {value} = evt.currentTarget;

    handleChange(value || "#ffffff");
    handleSubmit(value || "#ffffff");
  }


  return (
    <div>
      <IconButton onClick={handleToggle} src={Palette} />
      <div className="color-picker-container">
        <input
          ref={colorInput}
          className="color-picker-input"
          type="color"
          value={color}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default Color;
