import { useMutation } from "@apollo/client";
import { EDIT_LISTING, EDIT_LISTING_FILE } from "../../graphql/schemas";
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

  const [editListingFile, { error: updateListingFileError }] =
    useMutation(EDIT_LISTING_FILE);
  apolloHookErrorHandler("editListingFileError", updateListingFileError, true);
  const handleEditListingFile = (id: string, file: File | undefined) => {
    editListingFile({
      variables: {
        id,
        file,
      },
    });
  };

  return {
    handleEditListing,
    handleEditListingFile,
  };
};

export default ListingApolloHooks;
