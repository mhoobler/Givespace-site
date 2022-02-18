import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { ALL_CATALOGUE_FIELDS } from "../../graphql/fragments";
import { catalogueParser, updateCatalogueCache } from "../../utils/functions";
import {
  LIVE_CATALOGUE,
  INCREMENT_CATALOGUE_VIEWS,
  UPDATE_CATALOGUE,
  UPDATE_CATALOGUE_FILES,
  GET_CATALOGUE,
} from "../../graphql/schemas";
import { useFieldEditing, useMarkedForDeletion } from "../../state/store";
import { apolloHookErrorHandler } from "../../utils/functions";
import client from "../clientConfig";

const useCatalogueApolloHooks: CatalogueHook.FC = ({ id }: Props) => {
  const { markedForDeletion } = useMarkedForDeletion();
  const { fieldEditing } = useFieldEditing();

  const handleCatalogueQuery = (idVariable: { [x: string]: string }) => {
    const catalogueQuery = useQuery(GET_CATALOGUE, {
      nextFetchPolicy: "no-cache",
      variables: { ...idVariable },
      onCompleted: (data) => {
        console.log("query", data);
        if (data.catalogues && data.catalogues.length) {
          let catalogue = catalogueParser(
            data.catalogues[0],
            fieldEditing,
            markedForDeletion
          );

          console.log("query writing", catalogue);
          client.writeFragment({
            id: `Catalogue:${catalogue.id}`,
            fragment: ALL_CATALOGUE_FIELDS,
            fragmentName: "AllCatalogueFields",
            data: catalogue,
          });
        }
      },
    });
    apolloHookErrorHandler("catalogueQuery", catalogueQuery.error);
    return catalogueQuery;
  };

  const [incrementCatalogueViewsMuation, { error }] = useMutation(
    INCREMENT_CATALOGUE_VIEWS
  );
  apolloHookErrorHandler("useCatalogueApolloHooks.tsx", error);

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
          let catalogue = catalogueParser(
            data.liveCatalogue,
            fieldEditing,
            markedForDeletion
          );

          console.log("sub wrtigin catalogue", catalogue);
          client.writeFragment({
            id: `Catalogue:${catalogue.id}`,
            fragment: ALL_CATALOGUE_FIELDS,
            fragmentName: "AllCatalogueFields",
            data: catalogue,
          });
        }
      },
    });
    apolloHookErrorHandler("catalogueSubscription", subscription.error);

    return subscription;
  };

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
    incrementCatalogueViewsMuation,
    handleCatalogueQuery,
    handleCatalogueSubscription,
    editCatalogue,
    editCatalogueFile,
  };
};

export default useCatalogueApolloHooks;
