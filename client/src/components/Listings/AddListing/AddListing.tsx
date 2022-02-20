import React, { KeyboardEvent, useRef } from "react";

import "./AddListing.less";

type Props = {
  handleSubmit: (name: string) => void;
};

const AddListing: React.FC<Props> = ({ handleSubmit }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (inputRef.current) {
      const target = inputRef.current;

      handleSubmit(target.value);
      target.value = "";
    }
  };

  const handleKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === "Enter" && inputRef.current) {
      const target = inputRef.current;

      handleSubmit(target.value);
      target.value = "";
    }
  };

  return (
    <div className="add-listing-container">
      <label>Add Item:</label>
      <div className="inputs-container">
        <input ref={inputRef} onKeyDown={handleKeyDown} type="text" />
        <div className="btn-wrapper">
          <button className="btn btn-primary" onClick={handleClick}>
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddListing;
