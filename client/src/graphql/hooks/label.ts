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
    setTimeout(() => {
      createLabelMutation({
        variables: {
          name,
          catalogue_id: catalogue_id,
        },
      });
    }, 1000);
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
      catalogue
    );
  };

  const [reorderLabelMutation, { error: reorderLabelError }] =
    useMutation(UPDATE_LABEL_ORDER);
  apolloHookErrorHandler("reoderLabelError", reorderLabelError);
  const reorderLabel = (id: string, ordering: number) => {
    // Query this from cache
    const READ_LABELS = gql`
      ${LABEL_FIELDS}
      query ReadLabels($id: ID!) {
        catalogues(id: $id) {
          labels {
            ...AllLabelFields
          }
        }
      }
    `;

    // Read cacheLabels from cache then sortLabels
    const cacheLabels = (
      cache.readQuery({
        query: READ_LABELS,
        variables: { id: catalogue_id },
      }) as any
    ).catalogues[0].labels as Label[];
    const sortedLabels =
      cacheLabels && cacheLabels[0]
        ? [...cacheLabels].sort((a, b) => a.ordering - b.ordering)
        : [];

    // Helper variables to assist with array edges (explained below)
    const len = sortedLabels.length;
    const targetIndex = sortedLabels.findIndex((e: any) => e.id === id);
    const targetLabel = sortedLabels[targetIndex];

    if (!targetLabel) {
      throw new Error("Could not find label with index: " + targetIndex);
    }

    const orderingLabel = sortedLabels[ordering]; // possible undefined

    let newOrdering: number;

    // If TRUE, this means user did not move Label into new spot
    if (orderingLabel === targetLabel) {
      return;
      // User moved Label to end of LabelContainer
    } else if (ordering === len) {
      newOrdering = sortedLabels[len - 1].ordering + 1;
      // User moved Label to start of LabelContainer
    } else if (ordering === 0) {
      newOrdering = sortedLabels[0].ordering - 1;
      // User moved Label in between two other Labels
    } else {
      const nextOrdering = sortedLabels[ordering].ordering;
      const prevOrdering = sortedLabels[ordering - 1].ordering;
      newOrdering = (nextOrdering + prevOrdering) / 2;
    }

    // Update cache and fire Mutation
    updateCatalogueCache(`Label:${id}`, "ordering", newOrdering);
    reorderLabelMutation({
      variables: { id, ordering: newOrdering },
    });
  };

  return {
    createLabel,
    deleteLabel,
    reorderLabel,
  };
};

export default useLabelApolloHooks;
