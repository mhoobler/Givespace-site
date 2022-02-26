import { gql, useMutation } from "@apollo/client";
import {
  CREATE_LISTING,
  DELETE_LISTING,
  EDIT_LISTING,
  EDIT_LISTING_FILE,
  UPDATE_LISTING_ORDER,
} from "../../graphql/schemas";
import {
  handleDeletion,
  endOrdering,
  updateCatalogueCache,
  apolloHookErrorHandler,
  getCatalogueFromCache,
} from "../../utils/functions";
import { cache } from "../clientConfig";
import { dummyListing } from "../../utils/references";
import { useMarkedForDeletion, useRemoveMFD } from "../../state/store";
import { LISTING_FIELDS } from "../fragments";

const ListingApolloHooks: ListingHook.FC = () => {
  const { markedForDeletion, setMarkedForDeletion } = useMarkedForDeletion();
  const { setRemoveMFD } = useRemoveMFD();

  // CREATE
  const [createListingMutation, { error: createListingError }] =
    useMutation(CREATE_LISTING);
  apolloHookErrorHandler("createListingError", createListingError);

  const createListing = (catalogue_id: string) => (name: string) => {
    // TODO: when item is fetched alladditional listings get removed
    const catalogue = getCatalogueFromCache(catalogue_id);

    cache.modify({
      id: `Catalogue:${catalogue_id}`,
      fields: {
        listings(existing) {
          if (existing) {
            return [
              ...existing,
              {
                ...dummyListing(catalogue_id),
                name: name.slice(0, 50),
                ordering: endOrdering(catalogue?.listings || [], "min") - 1,
              },
            ];
          }
          return [
            {
              ...dummyListing(catalogue_id),
              name: name.slice(0, 50),
              ordering: 0,
            },
          ];
        },
      },
    });
    createListingMutation({
      variables: {
        name,
        catalogue_id,
      },
    });
  };

  // EDIT
  const [editListingMutation, { error: editListingError }] =
    useMutation(EDIT_LISTING);
  apolloHookErrorHandler("editListing", editListingError);

  const editListing: ListingHook.editListing =
    (id: string) => (value: string, keyProp: string) => {
      updateCatalogueCache(`Listing:${id}`, keyProp, value);
      editListingMutation({
        variables: {
          value,
          id,
          key: keyProp,
        },
      });
    };

  const editBoolean: ListingHook.editBoolean =
    (id: string) => async (value: Boolean, keyProp: string) => {
      updateCatalogueCache(`Listing:${id}`, keyProp, value);
      editListingMutation({
        variables: {
          value: value.toString(),
          id,
          key: keyProp,
        },
      });
    };

  const [editListingFileMutation, { error: updateListingFileError }] =
    useMutation(EDIT_LISTING_FILE);
  apolloHookErrorHandler("editListingFileError", updateListingFileError, true);

  const editListingFile: ListingHook.editListingFile =
    (id: string) => (file: File | undefined) => {
      editListingFileMutation({
        variables: {
          id,
          file,
        },
      });
    };

  const [reorderListingMutation, { error: reorderListingError }] =
    useMutation(UPDATE_LISTING_ORDER);
  apolloHookErrorHandler("reorderListingError", reorderListingError);

  const reorderListing =
    (catalogue_id: string) => (id: string, ordering: number) => {
      updateCatalogueCache(`Listing:${id}`, "ordering", ordering);
      reorderListingMutation({
        variables: { id, ordering },
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
    editBoolean,
    editListingFile,
    reorderListing,
    deleteListing,
  };
};

export default ListingApolloHooks;
