import React from "react";

import "./ListingCard.less";

type Props = {
  isEditing: boolean;
  listing: Listing;
};

const ListingCard: React.FC<Props> = ({ isEditing, listing }) => {
  return (
    <div className={`card ${isEditing ? "editing" : ""}`}>
      <div className="card-header text-center">. . .</div>
      <div className="card-body">
        <h4>{listing.name}</h4>
      </div>
    </div>
  );
};

export default ListingCard;
