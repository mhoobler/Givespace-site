import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  handleDeletion,
  maxOrdering,
  updateCatalogueCache,
} from "../../utils/functions";
import useCatalogueApolloHooks from "./useCatalogueApolloHooks";

import {
  CatalogueHeader,
  CatalogueItems,
  CatalogueToolbar,
} from "../../containers";
import { cache } from "../../graphql/clientConfig";
import { ALL_CATALOGUE_FIELDS } from "../../graphql/fragments";
import { dummyLabel, dummyListing } from "../../utils/references";
import ListingModal from "./ListingModal";
import { useMarkedForDeletion, useRemoveMFD } from "../../state/store";
import { UndoNotification } from "../../components";

const Catalogue: React.FC<{ is_edit_id?: boolean }> = ({ is_edit_id }) => {
  // Get Id from params and localStorage, especially for CatalogueApolloHooks
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const { markedForDeletion, setMarkedForDeletion } = useMarkedForDeletion();
  const { setRemoveMFD } = useRemoveMFD();
  const current_user_id = localStorage.getItem("authorization");
  const { corresponding_id } = useParams();
  const CatalogueIdVariables = is_edit_id
    ? { edit_id: corresponding_id }
    : { id: corresponding_id };

  // Inputs need to toggle from Editing to Display state
  const [isEditing, setIsEditing] = useState(true);

  // All ApolloHooks are moved to custom hook for organization
  const {
    incrementCatalogueViews,
    updateCatalogue,
    catalogueSubscription,
    updateCatalogueFiles,
    addLabelMutation,
    deleteLabelMutation,
    reorderLabelMutation,
    createListing,
    deleteListing,
  } = useCatalogueApolloHooks({
    CatalogueIdVariables,
  });

  // TODO: Need to make sure this only happens once per visit
  // (will currently trigger on each rerender)
  useEffect(() => {
    // delay gives time for the subscription to get set up
    setTimeout(() => {
      incrementCatalogueViews();
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

  // labels
  const sortedLabels =
    catalogue.labels && catalogue.labels[0]
      ? [...catalogue.labels].sort((a, b) => a.ordering - b.ordering)
      : [];

  const deleteLabel = (id: string) => {
    handleDeletion(
      id,
      "Label",
      () =>
        deleteLabelMutation({
          variables: { id },
          fetchPolicy: "no-cache",
        }),
      "name",
      setRemoveMFD,
      markedForDeletion,
      setMarkedForDeletion
    );
  };

  const reorderLabel = (id: string, ordering: number) => {
    const len = sortedLabels.length;
    const targetIndex = sortedLabels.findIndex((e: any) => e.id === id);
    const targetLabel = sortedLabels[targetIndex];

    if (!targetLabel) {
      throw new Error("Could not find label with id: " + id);
    }

    const orderingLabel = sortedLabels[ordering]; // possible undefined

    let newOrdering: number;

    if (orderingLabel === targetLabel) {
      return;
    } else if (ordering === len) {
      newOrdering = sortedLabels[len - 1].ordering + 1;
    } else if (ordering === 0) {
      newOrdering = sortedLabels[0].ordering - 1;
    } else {
      const nextOrdering = sortedLabels[ordering].ordering;
      const prevOrdering = sortedLabels[ordering - 1].ordering;
      newOrdering = (nextOrdering + prevOrdering) / 2;
    }
    updateCatalogueCache(`Label:${id}`, "ordering", newOrdering);
    reorderLabelMutation({
      variables: { id, ordering: newOrdering },
    });
  };

  // listings
  const sortedListings =
    catalogue.listings && catalogue.listings[0]
      ? [...catalogue.listings].sort((a, b) => a.ordering - b.ordering)
      : [];

  const handleAddListing = (name: string) => {
    console.log("handleAddListing", name);
    cache.modify({
      id: `Catalogue:${catalogue.id}`,
      fields: {
        listings(existing) {
          if (existing && !existing[0]) {
            return [
              {
                ...dummyListing,
                name: "doll",
                ordering: 0,
              },
            ];
          }
          return [
            ...existing,
            {
              ...dummyListing,
              name: "doll",
              ordering: maxOrdering(existing) + 1,
            },
          ];
        },
      },
    });
    createListing({
      variables: {
        name,
        catalogue_id: catalogue.id,
      },
    });
  };

  const handleDeleteListing = (id: string) => {
    handleDeletion(
      id,
      "Listing",
      () =>
        deleteListing({
          variables: {
            id,
          },
          fetchPolicy: "no-cache",
        }),
      "name",
      setRemoveMFD,
      markedForDeletion,
      setMarkedForDeletion
    );
  };

  const handleListingModalClose = () => {
    setSelectedListing(null);
  };

  const handleSelectListing = (listing: Listing) => {
    setSelectedListing(listing);
  };

  return (
    <div className="page-wrapper">
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
      <UndoNotification />
      <CatalogueItems
        isEditing={isEditing}
        addLabel={addLabel}
        deleteLabel={deleteLabel}
        reorderLabel={reorderLabel}
        labels={sortedLabels}
        listings={sortedListings}
        handleAddListing={handleAddListing}
        handleSelectListing={handleSelectListing}
        handleDeleteListing={handleDeleteListing}
      />
      <ListingModal
        isEditing={isEditing}
        listing={selectedListing}
        handleClose={handleListingModalClose}
      />
    </div>
  );

  // console.warn("error", error);
  // return <div> Uh oh something went wrong</div>;
};

export default Catalogue;
