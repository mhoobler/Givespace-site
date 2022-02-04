import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { ALL_CATALOGUE_FIELDS } from "../../graphql/fragments";
import {
  GET_CATALOGUE,
  LIVE_CATALOGUE,
  INCREMENT_CATALOGUE_VIEWS,
  UPDATE_CATALOGUE,
  UPDATE_CATALOGUE_FILES,
  CREATE_LABEL,
  DELETE_LABEL,
  UPDATE_LABEL_ORDER,
  CREATE_LISTING,
  DELETE_LISTING,
  EDIT_LISTING_FILE,
} from "../../graphql/schemas";
import { useFieldEditing, useMarkedForDeletion } from "../../state/store";
import {
  apolloHookErrorHandler,
  handleCacheDeletion,
} from "../../utils/functions";

type Props = {
  CatalogueIdVariables: any;
};

const CatalogueApolloHooks = ({ CatalogueIdVariables }: Props) => {
  const { markedForDeletion } = useMarkedForDeletion();
  const { fieldEditing } = useFieldEditing();

  const [
    updateCatalogue,
    { loading: _updateCatalogueLoading, error: updateCatalogueError },
  ] = useMutation(UPDATE_CATALOGUE);
  apolloHookErrorHandler("useCatalogueApolloHooks.tsx", updateCatalogueError);

  const [incrementCatalogueViews, { error }] = useMutation(
    INCREMENT_CATALOGUE_VIEWS,
    {
      variables: CatalogueIdVariables,
    }
  );
  apolloHookErrorHandler("useCatalogueApolloHooks.tsx", error);

  const catalogueSubscription = useSubscription(LIVE_CATALOGUE, {
    variables: CatalogueIdVariables,
    fetchPolicy: "no-cache",
    // Below creates a custom caching behaviour that
    // prevents the field currently being edited from
    // being written over
    onSubscriptionData: ({ client, subscriptionData }) => {
      const { data } = subscriptionData;
      if (data && data.liveCatalogue) {
        const catalogue = data.liveCatalogue;
        if (fieldEditing) delete catalogue[fieldEditing];
        client.writeFragment({
          id: `Catalogue:${catalogue.id}`,
          fragment: ALL_CATALOGUE_FIELDS,
          fragmentName: "AllCatalogueFields",
          variables: CatalogueIdVariables,
          data: catalogue,
        });
        // prevents labels from being shown if MFD
        const labelsMFD = catalogue.labels.filter((label: Label) =>
          markedForDeletion.find((mfd) => mfd.id.split(":")[1] === label.id)
        );
        labelsMFD.forEach((label: Label) => {
          handleCacheDeletion(`Label:${label.id}`);
        });
        // prevents labels from being shown if MFD
        const listingsMFD = catalogue.listings.filter((listing: Listing) =>
          markedForDeletion.find((mfd) => mfd.id.split(":")[1] === listing.id)
        );
        listingsMFD.forEach((listing: Listing) => {
          handleCacheDeletion(`Listing:${listing.id}`);
        });
      }
    },
  });
  // apolloHookErrorHandler(
  //   "useCatalogueApolloHooks.tsx",
  //   catalogueSubscription.error
  // );

  const catalogueQuery = useQuery(GET_CATALOGUE, {
    variables: CatalogueIdVariables,
  });
  apolloHookErrorHandler("useCatalogueApolloHooks.tsx", catalogueQuery.error);

  const [
    updateCatalogueFiles,
    { loading: _singleUploadLoading, error: singleUplaodError },
  ] = useMutation(UPDATE_CATALOGUE_FILES);
  apolloHookErrorHandler("updateCatalogueFiles", singleUplaodError);

  const [addLabelMutation, { error: createLabelError }] =
    useMutation(CREATE_LABEL);
  apolloHookErrorHandler("createLabelError", createLabelError);

  const [deleteLabelMutation, { error: deleteLabelError }] =
    useMutation(DELETE_LABEL);
  apolloHookErrorHandler("deleteLabelError", deleteLabelError, true);

  const [reorderLabelMutation, { error: reorderLabelError }] =
    useMutation(UPDATE_LABEL_ORDER);
  apolloHookErrorHandler("reoderLabelError", reorderLabelError);

  const [createListing, { error: createListingError }] =
    useMutation(CREATE_LISTING);
  apolloHookErrorHandler("createListingError", createListingError);
  const [deleteListing, { error: deleteListingError }] =
    useMutation(DELETE_LISTING);
  apolloHookErrorHandler("deleteListingError", deleteListingError, true);

  const [editListingFile, { error: updateListingFileError }] =
    useMutation(EDIT_LISTING_FILE);
  apolloHookErrorHandler("editListingFileError", updateListingFileError, true);

  return {
    incrementCatalogueViews,
    updateCatalogue,
    catalogueQuery,
    catalogueSubscription,
    updateCatalogueFiles,
    addLabelMutation,
    deleteLabelMutation,
    reorderLabelMutation,
    createListing,
    deleteListing,
    editListingFile,
  };
};

export default CatalogueApolloHooks;
