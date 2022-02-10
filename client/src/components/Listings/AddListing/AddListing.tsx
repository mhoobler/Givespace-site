import React, { useRef } from "react";

import "./AddListing.less";

type Props = {
  createListing: ListingHook.createListing;
};

const AddListing: React.FC<Props> = ({ createListing }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (inputRef.current) {
      const target = inputRef.current;

      //TODO: TODO: TODO: this needs catalogue id
      createListing(target.value, "");
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
