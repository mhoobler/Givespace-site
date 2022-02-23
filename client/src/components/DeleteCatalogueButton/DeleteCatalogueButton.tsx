import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Modal } from "..";
import { DELTETE_CATALOGUE } from "../../graphql/schemas";
import {
  apolloHookErrorHandler,
  handleCacheDeletion,
} from "../../utils/functions";

const DeleteCatalogueButton: React.FC<{ id: string }> = ({ id }) => {
  const [showModal, setShowModal] = useState(false);
  const [deleteCatalogue, { error }] = useMutation(DELTETE_CATALOGUE, {
    variables: { id },
    fetchPolicy: "no-cache",
  });

  apolloHookErrorHandler("CatalogueSelect.tsx", error);

  const handleDelete = () => {
    setShowModal(false);
    handleCacheDeletion(`Catalogue:${id}`);
    deleteCatalogue();
  };

  const handleClose = () => setShowModal(false);

  return (
    <div>
      <button className="btn btn-danger" onClick={() => setShowModal(true)}>
        Del
      </button>
      <Modal show={showModal} close={handleClose}>
        <Modal.Header>
          Are you sure you want to delete this catalogue?
        </Modal.Header>
        <Modal.Footer>
          <button onClick={handleClose}>cancel</button>
          <button onClick={handleDelete}>delete</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeleteCatalogueButton;
