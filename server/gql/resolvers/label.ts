import db from "../../db";
import { QueryResult } from "pg";
import { Catalogue, Label } from "../../types";
import {
  getFullCatalogues,
  endOrdering,
  notExist,
  publishCatalogue,
} from "../../utils/functions";
import { pubsub } from "../index";

const labelResolvers = {
  Query: {},
  Mutation: {
    createLabel: async (
      _: null,
      { catalogue_id, name }: { catalogue_id: string; name: string }
    ) => {
      let fullCatalogue: Catalogue[] | Catalogue = await getFullCatalogues(
        catalogue_id
      );
      fullCatalogue = fullCatalogue[0];
      notExist("Catalogue", fullCatalogue);

      const newLabelRes: QueryResult<Label> = await db.query(
        "INSERT INTO labels (catalogue_id, name, ordering) VALUES ($1, $2, $3) RETURNING *",
        [catalogue_id, name, endOrdering(fullCatalogue.labels, "max") + 1]
      );
      const newLabel: Label = newLabelRes.rows[0];

      publishCatalogue(catalogue_id);

      return newLabel;
    },
    deleteLabel: async (_: null, { id }: { id: string }): Promise<Label> => {
      const deletedLabelRes: QueryResult<Label> = await db.query(
        "DELETE FROM labels WHERE id = $1 RETURNING *",
        [id]
      );
      const deletedLabel: Label = deletedLabelRes.rows[0];

      notExist("Label", deletedLabel);

      publishCatalogue(deletedLabel.catalogue_id);

      return deletedLabel;
    },
    reorderLabel: async (
      _: null,
      { id, ordering }: { id: string; ordering: number }
    ): Promise<Label> => {
      const updatedLabelRes: QueryResult<Label> = await db.query(
        "UPDATE labels SET ordering = $1 WHERE id = $2 RETURNING *",
        [ordering, id]
      );
      const updatedLabel: Label = updatedLabelRes.rows[0];

      notExist("Label", updatedLabel);

      publishCatalogue(updatedLabelRes.rows[0].catalogue_id);

      return updatedLabel;
    },
  },
  Subscription: {},
};

export default labelResolvers;
