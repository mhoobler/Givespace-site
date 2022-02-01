import React, { useRef } from "react";

import "./AddListing.less";

type Props = {
  handleAddListing: (name: string) => void;
};

const AddListing: React.FC<Props> = ({ handleAddListing }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (inputRef.current) {
      const target = inputRef.current;

      handleAddListing(target.value);
      target.value = "";
    }
  };

  return (
    <div className="col-6 d-flex flex-column add-listing-container">
      <label>Add Item:</label>
      <div className="d-flex">
        <div className="inputs-container">
          <input ref={inputRef} type="text" />
          <button onClick={handleClick}>+</button>
        </div>
      </div>
    </div>
  );
};

export default AddListing;
