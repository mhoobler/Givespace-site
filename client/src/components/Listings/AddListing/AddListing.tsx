import React, { useRef } from "react";

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
    <div className="col-6 d-flex flex-column">
      <label>Add Item:</label>
      <div className="flex">
        <input ref={inputRef} type="text" />
        <button onClick={handleClick}>Submit</button>
      </div>
    </div>
  );
};

export default AddListing;
