import React from "react";

import { FileInput, Modal, TextInput } from "../../components";
import useListingApolloHooks from "./useListingModalHooks";

type Props = {
  listing: Listing | null;
  isEditing: boolean;
  handleClose: () => void;
};

const ListingModal: React.FC<Props> = ({ listing, isEditing, handleClose }) => {
  const { handleEditListing } = useListingApolloHooks();

  if (!listing) return null;

  // const handleFileSubmtit = (file: File | undefined, objectKey: string) => {
  //   editListingFile({
  //     variables: {
  //       id: listing!.id,
  //       file,
  //     },
  //   });
  // };
  console.log("listing: ", listing);
  console.log();

  return (
    <Modal show={listing !== null} close={handleClose}>
      {/* <FileInput
        isEditing={isEditing}
        handleSubmit={handleFileSubmtit}
        keyProp="image_url"
        value={listing!.image_url || ""}
      /> */}
      <TextInput
        isEditing={isEditing}
        handleSubmit={(value, keyProp) =>
          handleEditListing(listing.id, value, keyProp)
        }
        value={listing.name || ""}
        keyProp="name"
      />
      <Modal.Header close={handleClose}>{listing && listing.name}</Modal.Header>
      <Modal.Body>Test</Modal.Body>
    </Modal>
  );
};

export default ListingModal;
