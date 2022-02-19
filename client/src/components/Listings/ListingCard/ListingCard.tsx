import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconButton } from "../..";
import { cleanedPath } from "../../../utils/functions";

import { X } from "../../../assets";

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
  const navigate = useNavigate();
  const location = useLocation();
  const handleDelete = () => {
    deleteListing(listing.id);
  };

  const handleSelect = () => {
    let urlToNavigate: string = cleanedPath(location.pathname);
    // listing
    urlToNavigate += `/${listing.id}`;
    // add location.search if it exists
    if (location.search) {
      urlToNavigate += location.search;
    }
    navigate(urlToNavigate);
    selectListing(listing.id);
  };

  return (
    <div className={`card ${isEditing ? "editing" : ""}`}>
      <div className="card-header text-center">
        <span>. . .</span>
        <IconButton onClick={handleDelete} src={X} />
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
