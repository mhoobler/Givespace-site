import { useMutation } from "@apollo/client";
import { EDIT_LISTING } from "../../graphql/schemas";
import { apolloHookErrorHandler } from "../../utils/functions";

const ListingApolloHooks = () => {
  const [editListing, { error: updateCatalogueError }] =
    useMutation(EDIT_LISTING);
  apolloHookErrorHandler("editListing", updateCatalogueError);
  const handleEditListing = (id: string, value: string, key: string) => {
    console.log("handleEditListing", value, id, key);
    editListing({
      variables: {
        value,
        id,
        key,
      },
    });
  };

  return {
    handleEditListing,
  };
};

export default ListingApolloHooks;
