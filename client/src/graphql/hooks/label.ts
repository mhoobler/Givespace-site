import { gql, useMutation } from "@apollo/client";
import {
  handleDeletion,
  updateCatalogueCache,
  apolloHookErrorHandler,
  endOrdering,
  getCatalogueFromCache,
} from "../../utils/functions";
import { CREATE_LABEL, DELETE_LABEL, UPDATE_LABEL_ORDER } from "../schemas";
import { cache } from "../clientConfig";
import { dummyLabel } from "../../utils/references";
import { useMarkedForDeletion, useRemoveMFD } from "../../state/store";
import { LABEL_FIELDS } from "../fragments";

const useLabelApolloHooks: LabelHook.FC = ({ catalogue_id }) => {
  const { markedForDeletion, setMarkedForDeletion } = useMarkedForDeletion();
  const { setRemoveMFD } = useRemoveMFD();

  const [createLabelMutation, { error: createLabelError }] =
    useMutation(CREATE_LABEL);
  apolloHookErrorHandler("createLabelError", createLabelError);

  const createLabel = (name: string) => {
    const catalogue = getCatalogueFromCache(catalogue_id);

    cache.modify({
      id: `Catalogue:${catalogue_id}`,
      fields: {
        labels(existing): Label[] {
          console.log(existing);
          if (!existing) return [{ ...dummyLabel(catalogue_id), name }];
          return [
            ...existing,
            {
              ...dummyLabel(catalogue_id),
              name,
              ordering: endOrdering(catalogue?.labels || [], "max") + 1,
            },
          ];
        },
      },
    });
    createLabelMutation({
      variables: {
        name,
        catalogue_id: catalogue_id,
      },
    });
  };

  const [deleteLabelMutation, { error: deleteLabelError }] =
    useMutation(DELETE_LABEL);
  apolloHookErrorHandler("deleteLabelError", deleteLabelError, true);
  const deleteLabel = (id: string, catalogue: CatalogueType) => {
    // TODO: standardize undo
    handleDeletion(
      id,
      "Label",
      () =>
        deleteLabelMutation({
          variables: { id },
          fetchPolicy: "no-cache",
        }),
      "name",
      setRemoveMFD,
      markedForDeletion,
      setMarkedForDeletion,
      catalogue,
    );
  };

  const [reorderLabelMutation, { error: reorderLabelError }] =
    useMutation(UPDATE_LABEL_ORDER);
  apolloHookErrorHandler("reoderLabelError", reorderLabelError);
  const reorderLabel = (id: string, ordering: number) => {
    updateCatalogueCache(`Label:${id}`, "ordering", ordering);
    reorderLabelMutation({
      variables: { id, ordering },
    });
  };

  return {
    createLabel,
    deleteLabel,
    reorderLabel,
  };
};

export default useLabelApolloHooks;
