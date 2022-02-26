import React from "react";

type Props = {
  catalogueStub: CatalogueStub;
};

const CatalogueCard: React.FC<Props> = ({ catalogueStub }) => {
  return (
    <div className="card catalogue-card-container">
      <div className="card-header">HeaderImage</div>
      <div className="card-body">
        <div className="avatar-title-row">
          <div className="">AvatarImage</div>
          <div>
            <div>AuthorName</div>
            <div>Title</div>
          </div>
        </div>
      </div>
      <div className="description-row">Description</div>
      <div className="images-row">Images</div>
      <div className="options-row"></div>
    </div>
  );
};

export default CatalogueCard;
