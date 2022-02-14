import React from "react";
import useListingLabelApolloHooks from "../../graphql/hooks/listingLabel";
import Label from "./Label";

import "./LabelContainer.less";

type Props = {
  labels: Label[] | null;
  listing: Listing;
  isEditing: boolean;
};

const ListingLabelContainer: React.FC<Props> = ({
  labels,
  listing,
  isEditing,
}) => {
  const { addListingLabel, removeListingLabel } = useListingLabelApolloHooks();

  const labelsToShow: Label[] | null = isEditing
    ? labels
    : listing.labels && listing.labels.map((la: ListingLabel) => la.label);
  const handleListingClick = (label: Label) => {
    // if labelId is in listing.labels.id, remove it
    const listingLabelWithId: ListingLabel | undefined = listing.labels?.find(
      (l: ListingLabel) => l.label.id === label.id
    );
    if (listingLabelWithId) {
      removeListingLabel(listingLabelWithId.id);
    } else {
      addListingLabel(listing.id, label);
    }
  };

  return (
    <div className="labels-container">
      {labelsToShow?.map((label) => (
        <Label
          key={label.id}
          label={label}
          faint={
            !Boolean(
              listing.labels?.find((l: ListingLabel) => l.label.id === label.id)
            )
          }
          onClick={() => handleListingClick(label)}
          isEditing={isEditing}
        />
      ))}
    </div>
  );
};

export default ListingLabelContainer;
