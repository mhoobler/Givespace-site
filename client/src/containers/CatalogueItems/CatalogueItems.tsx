import React from "react";
import {
  LabelContainer,
  Label,
  ListingCard,
  ListingCardsContainer,
  AddListing,
} from "../../components";

import "./CatalogueItems.less";

type Props = {
  addLabel: (name: string) => void;
  deleteLabel: (id: string) => void;
  reorderLabel: (id: string, ordering: number) => void;
  isEditing: boolean;
  labels: Label[];
  listings: Listing[];
  handleAddListing: (name: string) => void;
  handleSelectListing: (listing: Listing) => void;
  handleDeleteListing: (id: string) => void;
};

const CatalogueItems: React.FC<Props> = ({
  labels,
  listings,
  addLabel,
  deleteLabel,
  reorderLabel,
  isEditing,
  handleAddListing,
  handleSelectListing,
  handleDeleteListing,
}) => {
  return (
    <div className="row catalogue-items-container">
      {/* add item, sort */}
      <div className="row">
        <AddListing handleAddListing={handleAddListing} />
        <div className="col-md-6 col-sm-12">Sort</div>
      </div>
      {/* labels */}
      <div className="col-12">
        <LabelContainer
          addLabel={addLabel}
          reorderLabel={reorderLabel}
          isEditing={isEditing}
        >
          {labels.map((e: Label) => (
            <Label
              key={e.id}
              className={`label ${isEditing ? "can-delete" : ""}`}
              label={e}
              isEditing={isEditing}
              deleteLabel={deleteLabel}
            />
          ))}
        </LabelContainer>
      </div>
      <ListingCardsContainer>
        {listings.map((e: Listing) => (
          <ListingCard
            key={e.id}
            listing={e}
            isEditing={isEditing}
            handleSelectListing={handleSelectListing}
            handleDeleteListing={handleDeleteListing}
          />
        ))}
      </ListingCardsContainer>
    </div>
  );
};

export default CatalogueItems;
