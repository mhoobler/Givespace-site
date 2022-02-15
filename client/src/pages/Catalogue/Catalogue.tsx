import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import {
  CatalogueHeader,
  CatalogueItems,
  CatalogueToolbar,
  ListingModal,
} from "../../containers";
import { cache } from "../../graphql/clientConfig";
import { ALL_CATALOGUE_FIELDS } from "../../graphql/fragments";
import { UndoNotification } from "../../components";

import useCatalogueApolloHooks from "../../graphql/hooks/catalogue";
import { useQuery } from "@apollo/client";
import { GET_CATALOGUE } from "../../graphql/schemas";

const Catalogue: React.FC = () => {
  // get navigation params
  const useQueryStrings = () => {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  };
  const queryStrings = useQueryStrings();
  const isEditId = Boolean(queryStrings.get("edit"));

  const [selectedListingId, setSelectedListingId] = useState<string | null>(
    null
  );

  const current_user_id = localStorage.getItem("authorization");
  const { corresponding_id } = useParams();
  if (!corresponding_id) throw new Error("no id on params");
  const idVariable = { [isEditId ? "edit_id" : "id"]: corresponding_id };

  // All ApolloHooks are moved to custom hook for organization
  const { incrementCatalogueViewsMuation, handleCatalogueSubscription } =
    useCatalogueApolloHooks({
      id: corresponding_id,
    });
  // query below scouts the catalogue and populates the cache
  // (that cache is how the catalogue is rendered)
  const catalogueQuery = useQuery(GET_CATALOGUE, {
    variables: { ...idVariable },
  });
  handleCatalogueSubscription(idVariable);

  // Inputs need to toggle from Editing to Display state
  const [isEditing, setIsEditing] = useState(true);
  useEffect(() => {
    incrementCatalogueViewsMuation({
      variables: { ...idVariable },
    });
  }, []);

  let catalogue: CatalogueType | null = null;
  if (catalogueQuery.error) {
    return <div>Catalogue not found</div>;
  }
  if (catalogueQuery.data && catalogueQuery.data.catalogues[0]) {
    // The catalogue being used in the catalogue state
    // will always be the cached catalogue as fetched
    // by CATALOGUE_FRAGMENT
    catalogue = cache.readFragment({
      id: `Catalogue:${catalogueQuery.data.catalogues[0].id}`,
      fragment: ALL_CATALOGUE_FIELDS,
      fragmentName: "AllCatalogueFields",
    });
  }

  if (!catalogue) {
    return <div>Loading...</div>;
  }

  let editable = isEditId || current_user_id === catalogue.user_id;

  // TODO: should sort this in the backend
  const sortedLabels =
    catalogue.labels && catalogue.labels[0]
      ? [...catalogue.labels].sort((a, b) => a.ordering - b.ordering)
      : [];

  // TODO: Should sort this in the backend
  const sortedListings =
    catalogue.listings && catalogue.listings[0]
      ? [...catalogue.listings].sort((a, b) => a.ordering - b.ordering)
      : [];

  const handleListingModalClose = () => {
    setSelectedListingId(null);
  };

  const handleSelectListing = (listingId: string) => {
    setSelectedListingId(listingId);
  };

  const selectedListing = selectedListingId
    ? catalogue.listings!.find((li: Listing) => li.id === selectedListingId)!
    : null;

  return (
    <div className="page-wrapper">
      <CatalogueToolbar editable={editable} />
      <CatalogueHeader
        isEditing={isEditing}
        catalogue={catalogue}
        toggleEdit={() => setIsEditing((prev) => !prev)}
      />
      <UndoNotification />
      <CatalogueItems
        catalogue={catalogue}
        isEditing={isEditing}
        labels={sortedLabels}
        listings={sortedListings}
        handleSelectListing={handleSelectListing}
      />
      <ListingModal
        isEditing={isEditing}
        labels={sortedLabels}
        listing={selectedListing}
        handleClose={handleListingModalClose}
      />
    </div>
  );
};

export default Catalogue;
