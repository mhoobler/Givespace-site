import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { ALL_CATALOGUE_FIELDS } from "../../graphql/fragments";
import {
  catalogueFEParser,
  removeFromCacheIfMFD,
  updateCatalogueCache,
} from "../../utils/functions";
import {
  LIVE_CATALOGUE,
  INCREMENT_CATALOGUE_VIEWS,
  UPDATE_CATALOGUE,
  UPDATE_CATALOGUE_FILES,
  GET_CATALOGUE,
} from "../../graphql/schemas";
import { useFieldEditing, useMarkedForDeletion } from "../../state/store";
import { apolloHookErrorHandler } from "../../utils/functions";

const useCatalogueApolloHooks: CatalogueHook.FC = ({ id }: Props) => {
  const { markedForDeletion } = useMarkedForDeletion();
  const { fieldEditing } = useFieldEditing();

  const handleCatalogueQuery = (idVariable: { [x: string]: string }) => {
    const catalogueQuery = useQuery(GET_CATALOGUE, {
      variables: { ...idVariable },
    });
    // prevents page from being reloaded on error
    if (catalogueQuery.error) {
      if (catalogueQuery.error.message.includes("Catalogue does not exist")) {
        console.log("catalogueQuery", ": Catalogue does not exist");
      } else {
        apolloHookErrorHandler("catalogueQuery", catalogueQuery.error);
      }
    }
    return catalogueQuery;
  };

  const handleCatalogueSubscription = (idVariable: { [x: string]: string }) => {
    const subscription = useSubscription(LIVE_CATALOGUE, {
      variables: { ...idVariable },
      fetchPolicy: "no-cache",
      // Below creates a custom caching behaviour that
      // prevents the field currently being edited from
      // being written over
      onSubscriptionData: ({ client, subscriptionData }) => {
        const { data } = subscriptionData;
        if (data && data.liveCatalogue) {
          let catalogue = catalogueFEParser(data.liveCatalogue, fieldEditing);
          client.writeFragment({
            id: `Catalogue:${catalogue.id}`,
            fragment: ALL_CATALOGUE_FIELDS,
            fragmentName: "AllCatalogueFields",
            data: catalogue,
          });
          removeFromCacheIfMFD(catalogue, markedForDeletion);
        }
      },
    });
    // prevents page from being reloaded on error
    if (subscription.error) {
      if (subscription.error.message.includes("Catalogue does not exist")) {
        console.log("catalogueSubscription", ": Catalogue does not exist");
      } else {
        apolloHookErrorHandler("catalogueSubscription", subscription.error);
      }
    }

    return subscription;
  };

  const [
    incrementCatalogueViewsMuation,
    { error: incrrementCatalogueViewsError },
  ] = useMutation(INCREMENT_CATALOGUE_VIEWS);
  // prevents page from being reloaded on error
  if (incrrementCatalogueViewsError) {
    if (
      incrrementCatalogueViewsError.message.includes("Catalogue does not exist")
    ) {
      console.log(
        "incrementCatalogueViewsMuation",
        ": Catalogue does not exist"
      );
    } else {
      apolloHookErrorHandler(
        "incrementCatalogueViewsMuation",
        incrrementCatalogueViewsError
      );
    }
  }

  const [
    editCatalogueMutation,
    { loading: _updateCatalogueLoading, error: updateCatalogueError },
  ] = useMutation(UPDATE_CATALOGUE);
  apolloHookErrorHandler("updateCatalogue", updateCatalogueError);

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
    incrementCatalogueViewsMuation,
    handleCatalogueQuery,
    handleCatalogueSubscription,
    editCatalogue,
    editCatalogueFile,
  };
};

export default useCatalogueApolloHooks;
