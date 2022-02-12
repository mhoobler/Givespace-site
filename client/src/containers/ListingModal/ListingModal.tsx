import React from "react";

import { FileInput, Label, Modal, TextInput } from "../../components";
import Checkbox from "../../components/fields/Checkbox/Checkbox";
import TextareaInput from "../../components/fields/TextreaInput/TextareaInput";
import useListingApolloHooks from "../../graphql/hooks/listing";

type Props = {
  listing: Listing | null;
  labels: Label[] | null;
  isEditing: boolean;
  handleClose: () => void;
};

const ListingModal: React.FC<Props> = ({
  listing,
  labels,
  isEditing,
  handleClose,
}) => {
  const {
    editListing,
    editBoolean,
    editListingFile,
    addListingLabel,
    removeListingLabel,
  } = useListingApolloHooks();

  if (!listing) return null;
  // console.log("ListingModal", listing);

  const labelsToShow: Label[] | null = isEditing
    ? labels
    : listing.labels && listing.labels.map((l) => l.label);
  const handleListingClick = (labelId: string) => {
    // if labelId is in listing.labels.id, remove it
    const listingLabelWithId: ListingLabel | undefined = listing.labels?.find(
      (l: ListingLabel) => l.label.id === labelId
    );
    if (listingLabelWithId) {
      console.log("removing label");
      removeListingLabel(listingLabelWithId.id);
    } else {
      console.log("adding label");
      addListingLabel(listing.id, labelId);
    }
  };

  return (
    <Modal show={listing !== null} close={handleClose}>
      <div>
        {labelsToShow?.map((label) => (
          <Label
            key={label.id}
            label={label}
            faint={
              !Boolean(
                listing.labels?.find(
                  (l: ListingLabel) => l.label.id === label.id
                )
              )
            }
            onClick={() => handleListingClick(label.id)}
            isEditing={isEditing}
          />
        ))}
      </div>
      <FileInput
        isEditing={isEditing}
        handleSubmit={editListingFile(listing.id)}
        keyProp="image_url"
        value={listing.image_url || ""}
      />
      <TextInput
        isEditing={isEditing}
        handleSubmit={editListing(listing.id)}
        value={listing.name || ""}
        keyProp="name"
        className="h2"
        placeholder="Title"
      />
      <TextareaInput
        isEditing={isEditing}
        handleSubmit={editListing(listing.id)}
        value={listing.description || ""}
        keyProp="description"
        placeholder="Description"
      />
      <TextInput
        isEditing={isEditing}
        handleSubmit={editListing(listing.id)}
        value={listing.price?.toString() || ""}
        keyProp="price"
        validator={(value) => {
          // if value contains letters return false
          return !/[a-z]/i.test(value);
        }}
        placeholder="Price"
      />
      <Checkbox
        isEditing={isEditing}
        value={listing.show_price}
        label="Show price"
        keyProp="show_price"
        onChange={editBoolean(listing.id)}
      />

      <Modal.Header close={handleClose}>{listing && listing.name}</Modal.Header>
      <Modal.Body>Test</Modal.Body>
    </Modal>
  );
};

export default ListingModal;
