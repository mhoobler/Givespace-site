import { useMutation } from "@apollo/client";
import {
  CREATE_LISTING,
  DELETE_LISTING,
  EDIT_LISTING,
  EDIT_LISTING_FILE,
} from "../../graphql/schemas";
import {
  handleDeletion,
  maxOrdering,
  updateCatalogueCache,
  apolloHookErrorHandler,
} from "../../utils/functions";
import { cache } from "../clientConfig";
import { dummyListing } from "../../utils/references";
import { useMarkedForDeletion, useRemoveMFD } from "../../state/store";

const ListingApolloHooks: ListingHook.FC = () => {
  const { markedForDeletion, setMarkedForDeletion } = useMarkedForDeletion();
  const { setRemoveMFD } = useRemoveMFD();

  // CREATE
  const [createListingMutation, { error: createListingError }] =
    useMutation(CREATE_LISTING);
  apolloHookErrorHandler("createListingError", createListingError);

  const createListing = (name: string, catalogue_id: string) => {
    console.log("handleAddListing", name);
    cache.modify({
      id: `Catalogue:${catalogue_id}`,
      fields: {
        listings(existing) {
          if (existing && !existing[0]) {
            return [
              {
                ...dummyListing,
                name: "doll",
                ordering: 0,
              },
            ];
          }
          return [
            ...existing,
            {
              ...dummyListing,
              name: "doll",
              ordering: maxOrdering(existing) + 1,
            },
          ];
        },
      },
    });
    createListingMutation({
      variables: {
        name,
        catalogue_id: catalogue_id,
      },
    });
  };

  // EDIT
  const [editListingMutation, { error: editListingError }] =
    useMutation(EDIT_LISTING);
  apolloHookErrorHandler("editListing", editListingError);

  const editListing = (id: string, value: string | boolean, key: string) => {
    updateCatalogueCache(`Listing:${id}`, key, value);

    if (typeof value === "boolean") value = value.toString();
    editListingMutation({
      variables: {
        value,
        id,
        key,
      },
    });
  };

  const [editListingFileMutation, { error: updateListingFileError }] =
    useMutation(EDIT_LISTING_FILE);
  apolloHookErrorHandler("editListingFileError", updateListingFileError, true);
  const editListingFile = (id: string, file: File | undefined) => {
    editListingFileMutation({
      variables: {
        id,
        file,
      },
    });
  };

  // DELETE
  const [deleteListingMutation, { error: deleteListingError }] =
    useMutation(DELETE_LISTING);
  apolloHookErrorHandler("deleteListingError", deleteListingError, true);
  const deleteListing = (id: string) => {
    handleDeletion(
      id,
      "Listing",
      () =>
        deleteListingMutation({
          variables: {
            id,
          },
          fetchPolicy: "no-cache",
        }),
      "name",
      setRemoveMFD,
      markedForDeletion,
      setMarkedForDeletion,
    );
  };

  return {
    createListing,
    editListing,
    editListingFile,
    deleteListing,
  };
};

export default ListingApolloHooks;
