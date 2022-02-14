import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { ALL_CATALOGUE_FIELDS } from "../../graphql/fragments";
import { updateCatalogueCache } from "../../utils/functions";
import {
  GET_CATALOGUE,
  LIVE_CATALOGUE,
  INCREMENT_CATALOGUE_VIEWS,
  UPDATE_CATALOGUE,
  UPDATE_CATALOGUE_FILES,
} from "../../graphql/schemas";
import { useFieldEditing, useMarkedForDeletion } from "../../state/store";
import { apolloHookErrorHandler } from "../../utils/functions";

const useCatalogueApolloHooks: CatalogueHook.FC = ({ id }: Props) => {
  const { markedForDeletion } = useMarkedForDeletion();
  const { fieldEditing } = useFieldEditing();

  const [incrementCatalogueViews, { error }] = useMutation(
    INCREMENT_CATALOGUE_VIEWS,
    {
      variables: { id },
    }
  );
  apolloHookErrorHandler("useCatalogueApolloHooks.tsx", error);

  const catalogueSubscription = useSubscription(LIVE_CATALOGUE, {
    variables: { id },
    fetchPolicy: "no-cache",
    // Below creates a custom caching behaviour that
    // prevents the field currently being edited from
    // being written over
    onSubscriptionData: ({ client, subscriptionData }) => {
      const { data } = subscriptionData;
      if (data && data.liveCatalogue) {
        const catalogue = data.liveCatalogue;

        // catalogue cleaning
        // if fieldEditing block the relevant update
        if (fieldEditing) delete catalogue[fieldEditing];
        // prevents labels from being shown if MFD
        const labelsMFD: Label[] | null = catalogue.labels
          ? catalogue.labels.filter((label: Label) =>
              markedForDeletion.find((mfd) => mfd.id.split(":")[1] === label.id)
            )
          : null;
        console.log("labelsMFD", labelsMFD);
        if (labelsMFD) {
          const labelsMFDIds: string[] = labelsMFD.map(
            (label: Label) => label.id
          );
          let newLabels: Label[] | null = catalogue.labels
            ? catalogue.labels.filter(
                (label: Label) => !labelsMFDIds.includes(label.id)
              )
            : [];
          if (newLabels && newLabels.length === 0) newLabels = null;
          catalogue.labels = newLabels;
        }
        // prevents listings from being shown if MFD
        const listingsMFD: Listing[] | null = catalogue.listings
          ? catalogue.listings.filter((listing: Listing) =>
              markedForDeletion.find(
                (mfd) => mfd.id.split(":")[1] === listing.id
              )
            )
          : null;
        if (listingsMFD) {
          const listingsMFDIds: string[] = listingsMFD.map(
            (listing: Listing) => listing.id
          );
          let newListings: Listing[] | null = catalogue.listings
            ? catalogue.listings.filter(
                (listing: Listing) => !listingsMFDIds.includes(listing.id)
              )
            : [];
          if (newListings && newListings.length === 0) newListings = null;
          catalogue.listings = newListings;
        }

        console.log("catalogueSubscription", catalogue);

        client.writeFragment({
          id: `Catalogue:${catalogue.id}`,
          fragment: ALL_CATALOGUE_FIELDS,
          fragmentName: "AllCatalogueFields",
          data: catalogue,
        });
      }
    },
  });
  // apolloHookErrorHandler(
  //   "useCatalogueApolloHooks.tsx",
  //   catalogueSubscription.error
  // );

  const catalogueQuery = useQuery(GET_CATALOGUE, {
    variables: { id },
  });
  apolloHookErrorHandler("useCatalogueApolloHooks.tsx", catalogueQuery.error);

  // UPDATE
  const [
    editCatalogueMutation,
    { loading: _updateCatalogueLoading, error: updateCatalogueError },
  ] = useMutation(UPDATE_CATALOGUE);
  apolloHookErrorHandler("updateCatalogueM<", updateCatalogueError);

  const editCatalogue = (text: string, objectKey: string) => {
    updateCatalogueCache(`Catalogue:${id}`, objectKey, text);
    editCatalogueMutation({
      variables: {
        id: id,
        key: objectKey,
        value: text,
      },
    });
  };

  const [
    editCatalogueFileMutation,
    { loading: _singleUploadLoading, error: singleUplaodError },
  ] = useMutation(UPDATE_CATALOGUE_FILES);
  apolloHookErrorHandler("updateCatalogueFiles", singleUplaodError);

  const editCatalogueFile = (file: File | undefined, objectKey: string) => {
    if (file) {
      editCatalogueFileMutation({
        variables: {
          id: id,
          key: objectKey,
          file,
        },
      });
    }
  };

  return {
    incrementCatalogueViews,
    catalogueQuery,
    catalogueSubscription,
    editCatalogue,
    editCatalogueFile,
  };
};

export default useCatalogueApolloHooks;
