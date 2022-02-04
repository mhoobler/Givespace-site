import React from "react";

import { FileInput, Modal } from "../../components";
import useCatalogueApolloHooks from "./useCatalogueApolloHooks";

type Props = {
  listing: Listing | null;
  isEditing: boolean;
  handleClose: () => void;
};

const ListingModal: React.FC<Props> = ({ listing, isEditing, handleClose }) => {
  if (!listing) {
    return null;
  }
  const { editListingFile } = useCatalogueApolloHooks({
    CatalogueIdVariables: { id: listing?.catalogue_id },
  });

  const handleFileSubmtit = (file: File | undefined, objectKey: string) => {
    editListingFile({
      variables: {
        id: listing!.id,
        file,
      },
    });
  };
  console.log("listing: ", listing);
  console.log();

  return (
    <Modal show={listing !== null} close={handleClose}>
      <FileInput
        isEditing={isEditing}
        handleSubmit={handleFileSubmtit}
        keyProp="image_url"
        value={listing!.image_url || ""}
      />
      <Modal.Header close={handleClose}>{listing && listing.name}</Modal.Header>
      <Modal.Body>Test</Modal.Body>
    </Modal>
  );
};

export default ListingModal;
