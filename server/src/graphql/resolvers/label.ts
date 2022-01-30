import db from "../../../db";
import { QueryResult } from "pg";
import { Label } from "../../types";

const labelResolvers = {
  Query: {},
  Mutation: {
    createLabel: async (
      _: null,
      { catalogue_id, name }: { catalogue_id: string; name: string },
    ) => {
      console.log(catalogue_id, name);
      const newLabelRes: QueryResult<Label> = await db.query(
        "INSERT INTO labels (catalogue_id, name) VALUES ($1, $2) RETURNING *",
        [catalogue_id, name],
      );
      const newLabel: Label = newLabelRes.rows[0];
      return newLabel;
    },
    deleteLabel: async (_: null, { id }: { id: string }): Promise<Label> => {
      const deletedLabelRes: QueryResult<Label> = await db.query(
        "DELETE FROM labels WHERE id = $1 RETURNING *",
        [id],
      );
      const deletedLabel: Label = deletedLabelRes.rows[0];
      if (!deletedLabel) {
        throw new Error("Label not found");
      }
      return deletedLabel;
    },
  },
  Subscription: {},
};

export default labelResolvers;
