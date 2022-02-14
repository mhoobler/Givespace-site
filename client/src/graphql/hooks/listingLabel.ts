import { useMutation } from "@apollo/client";
import { ADD_LISTING_LABEL, REMOVE_LISTING_LABEL } from "../../graphql/schemas";
import { handleDeletion, apolloHookErrorHandler } from "../../utils/functions";
import { cache } from "../clientConfig";
import { dummyListingLabel } from "../../utils/references";

const ListingLabelApolloHooks: ListingLabelHook.FC = () => {
  const [addListingLabelMutation, { error: addListingLabelError }] =
    useMutation(ADD_LISTING_LABEL);
  apolloHookErrorHandler("addListingLabelError", addListingLabelError);
  const addListingLabel = (listing_id: string, label: Label) => {
    const dummyListingLabelToUse = dummyListingLabel(label);
    cache.modify({
      id: `Listing:${listing_id}`,
      fields: {
        labels(existing) {
          if (!existing) return [dummyListingLabelToUse];
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
  apolloHookErrorHandler(
    "removeListingLabelError",
    removeListingLabelError,
    true
  );
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
    addListingLabel,
    removeListingLabel,
  };
};

export default ListingLabelApolloHooks;
