import React from "react";
import { DeleteCatalogueButton } from "..";
import { Share2 } from "../../assets";
import { handleCopy } from "../../utils/functions";

import "./CatalogueCard.less";

type Props = {
  catalogue: CatalogueStub;
};

const CatalogueCard: React.FC<Props> = ({ catalogue }) => {
  const handleShareClick = (evt: React.SyntheticEvent<HTMLButtonElement>) => {
    // This card will likely be wrapped in a link
    // preventDefault will stop navigation
    evt.preventDefault();
    console.log("share", evt);
    handleCopy(`/ctg/${catalogue.id}`);
  };

  return (
    <div className="card f-col catalogue-card">
      {/*TODO: need to somehow maintain aspect ratio of 6:1*/}
      <div
        className="card-header"
        style={{
          backgroundColor: !catalogue.profile_picture_url
            ? catalogue.header_color
            : "",
        }}
      >
        <img src={catalogue.header_image_url || "#"} />
      </div>
      <div className="f-col card-body">
        <div className="f-row avatar-title-author">
          <div className="avatar-image-wrapper">
            <img src={catalogue.profile_picture_url || ""} />
          </div>
          <div className="f-col title-author">
            <p>{catalogue.author}</p>
            <h5>{catalogue.title}</h5>
          </div>
        </div>
        <div className="description-row">
          <p>{catalogue.description}</p>
        </div>
        <div className="f-row images-row">
          {catalogue.listings &&
            catalogue.listings.slice(0, 3).map((e: ListingStub) => (
              <div key={e.id}>
                <img src={"https://via.placeholder.com/800"} alt="" />
              </div>
            ))}
        </div>
        <div className="f-row options-row">
          <DeleteCatalogueButton id={catalogue.id} />
          <button className="btn f-row option" onClick={handleShareClick}>
            <div>
              <img src={Share2} alt="share" />
            </div>
            <div className="fs-1">Share</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogueCard;
