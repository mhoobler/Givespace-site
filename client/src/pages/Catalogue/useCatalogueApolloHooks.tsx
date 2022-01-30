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
} from "../../graphql/schemas";
import { useFieldEditing } from "../../state/store";
import { apolloHookErrorHandler } from "../../utils/functions";

type Props = {
  CatalogueIdVariables: any;
};

const CatalogueApolloHooks = ({ CatalogueIdVariables }: Props) => {
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
  apolloHookErrorHandler("deleteLabelError", deleteLabelError);

  return {
    incrementCatalogueViews,
    updateCatalogue,
    catalogueQuery,
    catalogueSubscription,
    updateCatalogueFiles,
    addLabelMutation,
    deleteLabelMutation,
  };
};

export default CatalogueApolloHooks;
