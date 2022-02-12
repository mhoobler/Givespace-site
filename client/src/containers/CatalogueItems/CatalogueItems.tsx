import React from "react";
import {
  LabelContainer,
  Label,
  ListingCard,
  ListingCardsContainer,
  AddListing,
} from "../../components";
import useListingApolloHooks from "../../graphql/hooks/listing";
import useLabelApolloHooks from "../../graphql/hooks/label";
import useCatalogueApolloHooks from "../../graphql/hooks/catalogue";

import "./CatalogueItems.less";

type Props = {
  isEditing: boolean;
  catalogue_id: string;
  labels: Label[];
  listings: Listing[];
  handleSelectListing: (listing: Listing) => void;
};

const CatalogueItems: React.FC<Props> = ({
  labels,
  catalogue_id,
  listings,
  isEditing,
  handleSelectListing,
}) => {
  const { createListing, editListing, editListingFile, deleteListing } =
    useListingApolloHooks();
  const { createLabel, deleteLabel, reorderLabel } = useLabelApolloHooks({
    catalogue_id,
  });

  return (
    <div className="row catalogue-items-container">
      {/* add item, sort */}
      <div className="row">
        <AddListing handleSubmit={createListing(catalogue_id)} />
        <div className="col-md-6 col-sm-12">Sort</div>
      </div>
      {/* labels */}
      <div className="col-12">
        <LabelContainer
          createLabel={createLabel}
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
            selectListing={handleSelectListing}
            deleteListing={deleteListing}
          />
        ))}
      </ListingCardsContainer>
    </div>
  );
};

export default CatalogueItems;
