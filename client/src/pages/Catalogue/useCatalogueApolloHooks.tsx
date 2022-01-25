import { useMutation, useQuery, useSubscription } from "@apollo/client";
import {
  GET_CATALOGUE,
  LIVE_CATALOGUE,
  INCREMENT_CATALOGUE_VIEWS,
  UPDATE_CATALOGUE,
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
    { variables: CatalogueIdVariables },
  );
  apolloHookErrorHandler("useCatalogueApolloHooks.tsx", error);

  const catalogueSubscription = useSubscription(LIVE_CATALOGUE, {
    variables: CatalogueIdVariables,
  });
  apolloHookErrorHandler(
    "useCatalogueApolloHooks.tsx",
    catalogueSubscription.error,
  );

  const catalogueQuery = useQuery(GET_CATALOGUE, {
    variables: CatalogueIdVariables,
  });
  apolloHookErrorHandler("useCatalogueApolloHooks.tsx", catalogueQuery.error);

  console.log("catalogueQuery.data", catalogueQuery.data);

  return {
    incrementCatalogueViews,
    updateCatalogue,
    catalogueQuery,
    catalogueSubscription,
  };
};

export default CatalogueApolloHooks;
