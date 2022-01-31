import db from "../../../db";
import { QueryResult } from "pg";
import { Catalogue, Label } from "../../types";
import { getFullCatalogues } from "../../utils/functions";
import { pubsub } from "../index";

const labelResolvers = {
  Query: {},
  Mutation: {
    createLabel: async (
      _: null,
      { catalogue_id, name }: { catalogue_id: string; name: string }
    ) => {
      const fullCatalogue: Catalogue = (
        await getFullCatalogues(catalogue_id)
      )[0];
      if (!fullCatalogue) {
        throw new Error("No catalogue found");
      }
      const newLabelRes: QueryResult<Label> = await db.query(
        "INSERT INTO labels (catalogue_id, name, ordering) VALUES ($1, $2, $3) RETURNING *",
        [catalogue_id, name, fullCatalogue.labels.length]
      );
      const newLabel: Label = newLabelRes.rows[0];
      const newFullCatalogue: Catalogue = (
        await getFullCatalogues(catalogue_id)
      )[0];

      console.log("newFullCatalogue", newFullCatalogue);

      pubsub.publish("CATALOGUE_EDITED", {
        liveCatalogue: newFullCatalogue,
      });

      return newLabel;
    },
    deleteLabel: async (_: null, { id }: { id: string }): Promise<Label> => {
      const deletedLabelRes: QueryResult<Label> = await db.query(
        "DELETE FROM labels WHERE id = $1 RETURNING *",
        [id]
      );
      const deletedLabel: Label = deletedLabelRes.rows[0];
      if (!deletedLabel) {
        throw new Error("Label not found");
      }

      const fullCatalogue: Catalogue = (
        await getFullCatalogues(deletedLabel.catalogue_id)
      )[0];

      pubsub.publish("CATALOGUE_EDITED", {
        liveCatalogue: fullCatalogue,
      });

      return deletedLabel;
    },
    reorderLabel: async (
      _: null,
      { id, ordering }: { id: string; ordering: number }
    ): Promise<Label> => {
      // select all from labels where catalogue_id = id and order by ordering
      //const labelRes: QueryResult<Label> = await db.query(
      //  "SELECT * FROM labels WHERE id = $1",
      //  [id],
      //);
      //if (!labelRes.rows[0]) {
      //  throw new Error("Label not found");
      //}
      //const labelsRes: QueryResult<Label> = await db.query(
      //  "SELECT * FROM labels WHERE catalogue_id = $1 ",
      //  [labelRes.rows[0].catalogue_id],
      //);

      //const labels: Label[] = labelsRes.rows;
      //// order catalogue by id
      // const orderedLabels: Label[] = labels.sort(
      //  (a, b) => a.ordering - b.ordering,
      // );
      // let newOrdering;
      // if (ordering === 0) {
      //  newOrdering = orderedLabels[0].ordering - 1;
      // } else if (ordering === orderedLabels.length - 1) {
      //  newOrdering = orderedLabels[orderedLabels.length - 1].ordering + 1;
      // } else {
      //  let lowerLabelOrdering = orderedLabels[ordering - 1].ordering;
      //  let higherLabelOrdering = orderedLabels[ordering].ordering;
      //  if (orderedLabels[ordering - 1].id === id) {
      //    lowerLabelOrdering = orderedLabels[ordering].ordering;
      //    higherLabelOrdering = orderedLabels[ordering + 1].ordering;
      //  }
      //  if (orderedLabels[ordering].id === id) {
      //    return labelRes.rows[0];
      //  } else {
      //    newOrdering = (lowerLabelOrdering + higherLabelOrdering) / 2;
      //  }
      // }

      const updatedLabelRes: QueryResult<Label> = await db.query(
        "UPDATE labels SET ordering = $1 WHERE id = $2 RETURNING *",
        [ordering, id]
      );
      console.log("newOrdering", ordering);
      const updatedLabel: Label = updatedLabelRes.rows[0];

      const fullCatalogue: Catalogue = (
        await getFullCatalogues(updatedLabelRes.rows[0].catalogue_id)
      )[0];

      pubsub.publish("CATALOGUE_EDITED", {
        liveCatalogue: fullCatalogue,
      });

      return updatedLabel;
    },
  },
  Subscription: {},
};

export default labelResolvers;
