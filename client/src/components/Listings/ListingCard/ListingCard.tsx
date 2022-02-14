import React from "react";

import "./ListingCard.less";

type Props = {
  isEditing: boolean;
  listing: Listing;
  selectListing: (listingId: string) => void;
  deleteListing: (id: string) => void;
};

const ListingCard: React.FC<Props> = ({
  isEditing,
  listing,
  selectListing,
  deleteListing,
}) => {
  const handleDelete = () => {
    deleteListing(listing.id);
  };

  const handleSelect = () => {
    selectListing(listing.id);
  };

  return (
    <div className={`card ${isEditing ? "editing" : ""}`}>
      <div className="card-header text-center">
        <span>. . .</span>
        <button onClick={handleDelete}>x</button>
      </div>
      <div className="card-body" onClick={handleSelect}>
        <h4>{listing.name}</h4>
        {/* TODO: DELETE THIS */}
        <p>{listing.description}</p>
        {listing.show_price && (
          <h4>
            <span className="price">${listing.price}</span>
          </h4>
        )}
        <img
          style={{ width: "100px" }}
          src={
            listing.image_url ||
            "https://media.wired.com/photos/592722c1af95806129f51b71/master/pass/MIT-Web-Loading.jpg"
          }
        />
      </div>
    </div>
  );
};

export default ListingCard;
