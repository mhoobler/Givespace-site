import React from "react";

import { FileInput, Modal, TextInput } from "../../components";
import Checkbox from "../../components/fields/Checkbox/Checkbox";
import TextareaInput from "../../components/fields/TextreaInput/TextareaInput";
import useListingApolloHooks from "../../graphql/hooks/listing";

type Props = {
  listing: Listing | null;
  isEditing: boolean;
  handleClose: () => void;
};

const ListingModal: React.FC<Props> = ({ listing, isEditing, handleClose }) => {
  const { editListing, editBoolean, editListingFile } = useListingApolloHooks();

  if (!listing) return null;
  console.log("ListingModal", listing);

  return (
    <Modal show={listing !== null} close={handleClose}>
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
