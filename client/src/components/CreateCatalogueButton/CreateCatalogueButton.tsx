import { useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cache } from "../../graphql/clientConfig";
import { CREATE_CATALOGUE, MY_CATALOGUES } from "../../graphql/schemas";
import { apolloHookErrorHandler } from "../../utils/functions";

const CreateCatalogueButton = (): React.ReactElement => {
  const [createCatalogue, { loading, data, error }] =
    useMutation(CREATE_CATALOGUE);
  apolloHookErrorHandler("CreateCatalogueButton.tsx", error);

  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && data) {
      cache.updateQuery({ query: MY_CATALOGUES }, (prev) => {
        return {
          myCatalogues: [...prev.myCatalogues, data.createCatalogue],
        };
      });
      navigate("/ctg/" + data.createCatalogue.id);
    }
  }, [loading, data]);

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
