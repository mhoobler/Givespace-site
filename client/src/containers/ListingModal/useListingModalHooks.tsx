import { useMutation } from "@apollo/client";
import { EDIT_LISTING, EDIT_LISTING_FILE } from "../../graphql/schemas";
import {
  apolloHookErrorHandler,
  updateCatalogueCache,
} from "../../utils/functions";

const ListingApolloHooks = () => {
  const [editListing, { error: editListingError }] = useMutation(EDIT_LISTING);
  apolloHookErrorHandler("editListing", editListingError);
  const handleEditListing = (id: string, value: string, key: string) => {
    updateCatalogueCache(`Listing:${id}`, key, value);
    editListing({
      variables: {
        value,
        id,
        key,
      },
    });
  };
  const handleShowPrice = async (value: Boolean, id: string) => {
    updateCatalogueCache(`Listing:${id}`, "show_price", value);
    editListing({
      variables: {
        value: value.toString(),
        id,
        key: "show_price",
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
    handleShowPrice,
  };
};

export default ListingApolloHooks;
