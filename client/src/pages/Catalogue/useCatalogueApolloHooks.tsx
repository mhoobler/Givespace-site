import { useMutation, useQuery, useSubscription } from "@apollo/client";
import {
  GET_CATALOGUE,
  LIVE_CATALOGUE,
  INCREMENT_CATALOGUE_VIEWS,
  UPDATE_CATALOGUE,
  UPDATE_CATALOGUE_FILES,
} from "../../graphql/schemas";
import { apolloHookErrorHandler } from "../../utils/functions";

type Props = {
  CatalogueIdVariables: any;
};

const CatalogueApolloHooks = ({ CatalogueIdVariables }: Props) => {
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
    // onSubscriptionData: ({ client, subscriptionData }) => {
    //   const { data } = subscriptionData;
    //   console.log("catalogueSubscription", data);
    //   if (data && data.liveCatalogue) {
    //     const catalogue = data.liveCatalogue;
    //     if (fieldEditing) delete catalogue[fieldEditing];
    //     console.log("catalogueSubscription", catalogue);
    //     client.writeFragment({
    //       id: `Catalogue:${catalogue.id}`,
    //       fragment: CATALOGUE_FRAGMENT,
    //       variables: CatalogueIdVariables,
    //       data: {
    //         catalogue,
    //       },
    //     });
    //     console.log("POST");
    //   }
    // },
  });
  apolloHookErrorHandler(
    "useCatalogueApolloHooks.tsx",
    catalogueSubscription.error
  );

  const catalogueQuery = useQuery(GET_CATALOGUE, {
    variables: CatalogueIdVariables,
  });
  apolloHookErrorHandler("useCatalogueApolloHooks.tsx", catalogueQuery.error);

  const [
    updateCatalogueFiles,
    { loading: _singleUploadLoading, error: singleUplaodError },
  ] = useMutation(UPDATE_CATALOGUE_FILES);
  apolloHookErrorHandler("updateCatalogueFiles", singleUplaodError);

  return {
    incrementCatalogueViews,
    updateCatalogue,
    catalogueQuery,
    catalogueSubscription,
    updateCatalogueFiles,
  };
};

export default CatalogueApolloHooks;
