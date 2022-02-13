import React from "react";
import {
  LabelContainer,
  Label,
  ListingCard,
  ListingCardsContainer,
  AddListing,
  DragAndDrop,
  Draggable,
} from "../../components";
import useListingApolloHooks from "../../graphql/hooks/listing";
import useLabelApolloHooks from "../../graphql/hooks/label";

import "./CatalogueItems.less";

type Props = {
  isEditing: boolean;
  catalogue: CatalogueType;
  labels: Label[];
  listings: Listing[];
  handleSelectListing: (listingId: string) => void;
};

const CatalogueItems: React.FC<Props> = ({
  labels,
  catalogue,
  listings,
  isEditing,
  handleSelectListing,
}) => {
  const { createListing, editListing, editListingFile, deleteListing } =
    useListingApolloHooks();
  const { createLabel, deleteLabel, reorderLabel } = useLabelApolloHooks({
    catalogue_id: catalogue.id,
  });

  return (
    <div className="row catalogue-items-container">
      {/* add item, sort */}
      <div className="row">
        <AddListing handleSubmit={createListing(catalogue.id)} />
        <div className="col-md-6 col-sm-12">Sort</div>
      </div>
      {/* labels */}
      <div className="col-12">
        <LabelContainer createLabel={createLabel} isEditing={isEditing}>
          <DragAndDrop handleReorder={reorderLabel}>
            {labels.map((e: Label) => (
              <Draggable key={e.id} refData={e}>
                <Label
                  key={e.id}
                  className={`label ${isEditing ? "can-delete" : ""}`}
                  label={e}
                  isEditing={isEditing}
                  deleteLabel={(id) => deleteLabel(id, catalogue)}
                />
              </Draggable>
            ))}
          </DragAndDrop>
        </LabelContainer>
      </div>
      <ListingCardsContainer>
        {listings.map((e: Listing) => (
          <ListingCard
            key={e.id}
            listing={e}
            isEditing={isEditing}
            selectListing={handleSelectListing}
            deleteListing={deleteListing}
          />
        ))}
      </ListingCardsContainer>
    </div>
  );
};

export default CatalogueItems;
