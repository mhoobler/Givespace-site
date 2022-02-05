import React from "react";

import { FileInput, Modal, TextInput } from "../../components";
import Checkbox from "../../components/fields/Checkbox/Checkbox";
import TextareaInput from "../../components/fields/TextreaInput/TextareaInput";
import useListingApolloHooks from "./useListingModalHooks";

type Props = {
  listing: Listing | null;
  isEditing: boolean;
  handleClose: () => void;
};

const ListingModal: React.FC<Props> = ({ listing, isEditing, handleClose }) => {
  const { handleEditListing, handleEditListingFile, handleShowPrice } =
    useListingApolloHooks();

  if (!listing) return null;
  console.log("ListingModal", listing);

  return (
    <Modal show={listing !== null} close={handleClose}>
      <FileInput
        isEditing={isEditing}
        handleSubmit={(file, _) => handleEditListingFile(listing.id, file)}
        keyProp="image_url"
        value={listing.image_url || ""}
      />
      <TextInput
        isEditing={isEditing}
        handleSubmit={(value, keyProp) =>
          handleEditListing(listing.id, value, keyProp)
        }
        value={listing.name || ""}
        keyProp="name"
        className="h2"
        placeholder="Title"
      />
      <TextareaInput
        isEditing={isEditing}
        handleSubmit={(value, keyProp) =>
          handleEditListing(listing.id, value, keyProp)
        }
        value={listing.description || ""}
        keyProp="description"
        placeholder="Description"
      />
      <TextInput
        isEditing={isEditing}
        handleSubmit={(value, keyProp) =>
          handleEditListing(listing.id, value, keyProp)
        }
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
        onChange={(value: Boolean) => handleShowPrice(value, listing.id)}
      />

      <Modal.Header close={handleClose}>{listing && listing.name}</Modal.Header>
      <Modal.Body>Test</Modal.Body>
    </Modal>
  );
};

export default ListingModal;
