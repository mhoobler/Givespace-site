import React from "react";

import { Modal } from "../../components";

type Props = {
  listing: Listing | null;
  handleClose: () => void;
};

const ListingModal: React.FC<Props> = ({ listing, handleClose }) => {
  return (
    <Modal show={listing !== null} close={handleClose}>
      <Modal.Header close={handleClose}>{listing && listing.name}</Modal.Header>
      <Modal.Body>Test</Modal.Body>
    </Modal>
  );
};

export default ListingModal;
