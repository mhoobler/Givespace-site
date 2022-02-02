import { useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { cache } from "../../graphql/clientConfig";
import { DELTETE_CATALOGUE } from "../../graphql/schemas";
import {
  apolloHookErrorHandler,
  handleCacheDeletion,
} from "../../utils/functions";

const DeleteCatalogueButton: React.FC<{ id: string }> = ({ id }) => {
  const [deleteCatalogue, { loading, error }] = useMutation(DELTETE_CATALOGUE, {
    variables: { id },
    fetchPolicy: "no-cache",
  });

  apolloHookErrorHandler("CatalogueSelect.tsx", error);

  const handleDelete = () => {
    // add a verification dialog
    if (window.confirm("Are you sure you want to delete this catalogue?")) {
      handleCacheDeletion(`Catalogue:${id}`);
      deleteCatalogue();
    }
  };

  return (
    <button className="btn btn-danger" onClick={handleDelete}>
      Del
    </button>
  );
};

export default DeleteCatalogueButton;
