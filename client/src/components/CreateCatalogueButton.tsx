import { useMutation } from "@apollo/client";
import React from "react";
import { useNavigate } from "react-router-dom";
import { cache } from "../graphql/clientConfig";
import { CREATE_CATALOGUE, MY_CATALOGUES } from "../graphql/schemas";

const CreateCatalogueButton = (): React.ReactElement => {
  const [createCatalogue, { loading, data }] = useMutation(CREATE_CATALOGUE);

  const navigate = useNavigate();
  if (!loading && data) {
    cache.updateQuery({ query: MY_CATALOGUES }, (prev) => {
      return {
        myCatalogues: [...prev.myCatalogues, data.createCatalogue],
      };
    });
    navigate("/list/" + data.createCatalogue.id);
  }

  const handleClick = async () => {
    createCatalogue();
  };

  return (
    <button onClick={handleClick} className="btn btn-success">
      New Catalogue
    </button>
  );
};

export default CreateCatalogueButton;
