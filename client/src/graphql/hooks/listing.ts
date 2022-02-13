import { useMutation } from "@apollo/client";
import {
  ADD_LISTING_LABEL,
  CREATE_LISTING,
  DELETE_LISTING,
  EDIT_LISTING,
  EDIT_LISTING_FILE,
  REMOVE_LISTING_LABEL,
} from "../../graphql/schemas";
import {
  handleDeletion,
  maxOrdering,
  updateCatalogueCache,
  apolloHookErrorHandler,
} from "../../utils/functions";
import client, { cache } from "../clientConfig";
import { dummyListing, dummyListingLabel } from "../../utils/references";
import { useMarkedForDeletion, useRemoveMFD } from "../../state/store";

const ListingApolloHooks: ListingHook.FC = () => {
  const { markedForDeletion, setMarkedForDeletion } = useMarkedForDeletion();
  const { setRemoveMFD } = useRemoveMFD();

  // CREATE
  const [createListingMutation, { error: createListingError }] =
    useMutation(CREATE_LISTING);
  apolloHookErrorHandler("createListingError", createListingError);

  const createListing = (catalogue_id: string) => (name: string) => {
    console.log("handleAddListing", catalogue_id);
    // TODO: when item is fetched alladditional listings get removed
    cache.modify({
      id: `Catalogue:${catalogue_id}`,
      fields: {
        listings(existing) {
          console.log("existing", existing);
          if (existing) {
            console.log("newListing", [
              ...existing,
              {
                ...dummyListing(catalogue_id),
                ordering: maxOrdering(existing) + 1,
              },
            ]);
            return [
              ...existing,
              {
                ...dummyListing(catalogue_id),
                ordering: maxOrdering(existing) + 1,
              },
            ];
          }
          console.log("post existing", existing);
          return [
            {
              ...dummyListing(catalogue_id),
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
      setMarkedForDeletion
    );
  };

  const [addListingLabelMutation, { error: addListingLabelError }] =
    useMutation(ADD_LISTING_LABEL);
  apolloHookErrorHandler("addListingLabelError", deleteListingError);
  const addListingLabel = (listing_id: string, label: Label) => {
    const dummyListingLabelToUse = dummyListingLabel(label);
    cache.modify({
      id: `Listing:${listing_id}`,
      fields: {
        labels(existing) {
          if (!existing) [dummyListingLabelToUse];
          return [...existing, dummyListingLabelToUse];
        },
      },
    });

    addListingLabelMutation({
      variables: {
        listing_id: listing_id,
        label_id: label.id,
      },
    });
  };

  const [removeListingLabelMutation, { error: removeListingLabelError }] =
    useMutation(REMOVE_LISTING_LABEL);
  apolloHookErrorHandler("removeListingLabelError", deleteListingError);
  const removeListingLabel = (id: string) => {
    handleDeletion(id, "ListingLabel", () =>
      removeListingLabelMutation({
        variables: {
          id,
        },
      })
    );
  };

  return {
    createListing,
    editListing,
    editBoolean,
    editListingFile,
    deleteListing,
    addListingLabel,
    removeListingLabel,
  };
};

export default ListingApolloHooks;
