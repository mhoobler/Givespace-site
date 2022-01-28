import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { updateCatalogueCache } from "../../utils/functions";
import useCatalogueApolloHooks from "./useCatalogueApolloHooks";

import { CatalogueHeader, CatalogueToolbar } from "../../containers";

const Catalogue: React.FC<{ is_edit_id?: boolean }> = ({ is_edit_id }) => {
  // Get Id from params and localStorage, especially for CatalogueApolloHooks
  const current_user_id = localStorage.getItem("authorization");
  const { corresponding_id } = useParams();
  const CatalogueIdVariables = is_edit_id
    ? { edit_id: corresponding_id }
    : { id: corresponding_id };

  // Inputs need to toggle from Editing to Display state
  const [isEditing, setIsEditing] = useState(false);

  // All ApolloHooks are moved to custom hook for organization
  const {
    incrementCatalogueViews,
    updateCatalogue,
    catalogueQuery,
    catalogueSubscription,
    updateCatalogueFiles,
  } = useCatalogueApolloHooks({
    CatalogueIdVariables,
  });

  // TODO: Need to make sure this only happens once per visit
  // (will currently trigger on each rerender)
  useEffect(() => {
    incrementCatalogueViews();
  }, []);

  if (!catalogueQuery.data && !catalogueSubscription.data) {
    return <div>Loading...</div>;
  }

  // This needs to update cache
  const catalogue = catalogueSubscription.data
    ? catalogueSubscription.data.liveCatalogue
    : catalogueQuery.data.catalogues[0];

  if (!catalogue) {
    return <h1>Catalogue not found</h1>;
  }

  let editable = is_edit_id || current_user_id === catalogue.user_id;

  const handleTextInput = (text: string, objectKey: string) => {
    updateCatalogueCache(`Catalogue:${catalogue.id}`, objectKey, text);
    updateCatalogue({
      variables: {
        id: catalogue.id,
        key: objectKey,
        value: text,
      },
    });
  };

  const handleFileInput = (file: File | undefined, objectKey: string) => {
    if (file) {
      console.log("fileOnSubmit", file);
      updateCatalogueFiles({
        variables: {
          id: catalogue.id,
          key: objectKey,
          file,
        },
      });
    }
  };

  const handleDDSubmit = (value: string, objectKey: string) => {
    updateCatalogueCache(`Catalogue:${catalogue.id}`, objectKey, value);
    updateCatalogue({
      variables: {
        id: catalogue.id,
        key: objectKey,
        value,
      },
    });
  };

  return (
    <div className="page-padding">
      <CatalogueToolbar editable={editable} />
      <CatalogueHeader
        isEditing={isEditing}
        catalogue={catalogue}
        handleTextInput={handleTextInput}
        handleFileInput={handleFileInput}
        handleDDSubmit={handleDDSubmit}
        toggleEdit={() => setIsEditing((prev) => !prev)}
      />
    </div>
  );

  // console.warn("error", error);
  // return <div> Uh oh something went wrong</div>;
};

export default Catalogue;
