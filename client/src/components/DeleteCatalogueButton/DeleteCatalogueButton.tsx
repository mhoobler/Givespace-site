import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Modal } from "..";
import { Trash2 } from "../../assets";
import { DELTETE_CATALOGUE } from "../../graphql/schemas";
import {
  apolloHookErrorHandler,
  handleCacheDeletion,
} from "../../utils/functions";

const DeleteCatalogueButton: React.FC<{
  id: string;
}> = ({ id }) => {
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
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <button className="btn f-row option" onClick={() => setShowModal(true)}>
        <div>
          <img src={Trash2} alt="delete" />
        </div>
        <div className="fs-1"> Delete</div>
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
