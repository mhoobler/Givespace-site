import { useMutation } from "@apollo/client";
import { ADD_LINK, EDIT_LINK, REMOVE_LINK } from "../../graphql/schemas";
import {
  handleDeletion,
  updateCatalogueCache,
  apolloHookErrorHandler,
} from "../../utils/functions";
import { cache } from "../clientConfig";
import { dummyLink } from "../../utils/references";

const LinkApolloHooks: LinkHook.FC = () => {
  const [addLinkMutation, { error: addLinkError }] = useMutation(ADD_LINK);
  apolloHookErrorHandler("addLinkError", addLinkError);
  const addLink = (listing_id: string, url: string) => {
    const dummyLinkToUse = dummyLink(listing_id, url);
    cache.modify({
      id: `Listing:${listing_id}`,
      fields: {
        links(existing) {
          console.log("existing", existing);
          if (!existing) return [dummyLinkToUse];
          return [...existing, dummyLinkToUse];
        },
      },
    });
    addLinkMutation({
      variables: {
        listing_id,
        url,
      },
    });
  };

  const [removeLinkMutation, { error: removeLinkError }] =
    useMutation(REMOVE_LINK);
  apolloHookErrorHandler("removeLinkError", removeLinkError, true);
  const removeLink = (id: string) => {
    handleDeletion(id, "Link", () =>
      removeLinkMutation({
        variables: {
          id,
        },
      })
    );
  };

  const [editLinkMutation, { error: editLinkError }] = useMutation(EDIT_LINK);
  apolloHookErrorHandler("editLinkError", editLinkError);
  const editLink = (id: string, value: string, key: string) => {
    updateCatalogueCache(`Link:${id}`, key, value);
    editLinkMutation({
      variables: {
        id,
        key,
        value,
      },
    });
  };

  return {
    addLink,
    removeLink,
    editLink,
  };
};

export default LinkApolloHooks;
