import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { updateCatalogueCache } from "../../utils/functions";
import useCatalogueApolloHooks from "./useCatalogueApolloHooks";

import {
  CatalogueHeader,
  CatalogueItems,
  CatalogueToolbar,
} from "../../containers";
import { cache } from "../../graphql/clientConfig";
import { ALL_CATALOGUE_FIELDS } from "../../graphql/fragments";
import { dummyLabel } from "../../utils/references";

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
    catalogueSubscription,
    updateCatalogueFiles,
    addLabelMutation,
    deleteLabelMutation,
  } = useCatalogueApolloHooks({
    CatalogueIdVariables,
  });

  // TODO: Need to make sure this only happens once per visit
  // (will currently trigger on each rerender)
  useEffect(() => {
    // delay gives time for the subscription to get set up
    setTimeout(() => {
      incrementCatalogueViews();
      console.log("incremented views");
    }, 1);
  }, []);

  if (!catalogueSubscription.data) {
    return <div>Loading...</div>;
  }

  // The catalogue being used in the catalogue state
  // will always be the cached catalogue as fetched
  // by CATALOGUE_FRAGMENT
  const catalogue: CatalogueType | null = cache.readFragment({
    id: `Catalogue:${catalogueSubscription.data.liveCatalogue.id}`,
    fragment: ALL_CATALOGUE_FIELDS,
    fragmentName: "AllCatalogueFields",
  });
  console.log("catalogue", catalogue);

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

  const handleDateInput = (ISOString: string, objectKey: string) => {
    handleTextInput(ISOString, objectKey);
  };

  // TODO: These still need to update Cache
  const addLabel = (name: string) => {
    cache.modify({
      id: `Catalogue:${catalogue.id}`,
      fields: {
        labels(existing) {
          if (existing && !existing[0]) {
            return [{ ...dummyLabel, name, ordering: existing.length }];
          }
          return [
            ...existing,
            { ...dummyLabel, name, ordering: existing.length },
          ];
        },
      },
    });
    addLabelMutation({
      variables: {
        name,
        catalogue_id: catalogue.id,
      },
    });
  };

  const deleteLabel = (id: string) => {
    cache.evict({ id: `Label:${id}` });
    cache.gc();

    console.log("deleting label", id);
    deleteLabelMutation({
      variables: { id },
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
        handleDateInput={handleDateInput}
        toggleEdit={() => setIsEditing((prev) => !prev)}
      />
      <CatalogueItems
        isEditing={isEditing}
        addLabel={addLabel}
        deleteLabel={deleteLabel}
        labels={catalogue.labels && catalogue.labels[0] ? catalogue.labels : []}
        items={null}
      />
    </div>
  );

  // console.warn("error", error);
  // return <div> Uh oh something went wrong</div>;
};

export default Catalogue;
