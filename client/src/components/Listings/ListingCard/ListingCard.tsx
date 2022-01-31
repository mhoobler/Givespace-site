import React from "react";

import "./ListingCard.less";

type Props = {
  isEditing: boolean;
  listing: Listing;
  handleSelectListing: (listing: Listing) => void;
  handleDeleteListing: (id: string) => void;
};

const ListingCard: React.FC<Props> = ({
  isEditing,
  listing,
  handleSelectListing,
  handleDeleteListing,
}) => {
  const handleDelete = () => {
    handleDeleteListing(listing.id);
  };

  const handleSelect = () => {
    handleSelectListing(listing);
  };

  return (
    <div className={`card ${isEditing ? "editing" : ""}`}>
      <div className="card-header text-center">
        <span>. . .</span>
        <button onClick={handleDelete}>x</button>
      </div>
      <div className="card-body" onClick={handleSelect}>
        <h4>{listing.name}</h4>
      </div>
    </div>
  );
};

export default ListingCard;
