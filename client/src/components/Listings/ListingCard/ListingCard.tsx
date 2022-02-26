import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconButton, Label, LabelContainer } from "../..";
import { cleanedPath } from "../../../utils/functions";

import { DragHorizontal, X } from "../../../assets";

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
    <div
      onClick={handleSelect}
      className={`card ${isEditing ? "editing" : ""} listing-card`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card-header text-center"
      >
        <img src={DragHorizontal} alt="drag" />
        <IconButton onClick={handleDelete} src={X} />
      </div>
      <div className="card-body listing-card-body">
        <div className="listing-image-wrapper">
          <img
            src={
              listing.image_url ||
              "https://media.wired.com/photos/592722c1af95806129f51b71/master/pass/MIT-Web-Loading.jpg"
            }
            draggable={false}
          />
        </div>

        <div className="listing-title-description">
          <h5>{listing.name}</h5>
          <p>{listing.description}</p>
        </div>

        <div className="listing-labels">
          <LabelContainer>
            {listing.labels &&
              listing.labels.map((e: ListingLabel) => {
                return <Label key={e.id} label={e.label} />;
              })}
          </LabelContainer>
        </div>

        <div className="listing-price">
          {listing.show_price && listing.price && (
            <span className="price">${listing.price}</span>
          )}
        </div>

        <div className="listing-links-container">
          {listing.links &&
            listing.links.map((e: Link) => (
              <div
                key={e.id}
                className={`link-wrapper length-${listing.links!.length - 1}`}
              >
                <div className="link">
                  <span key={e.id}> {e.title}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
