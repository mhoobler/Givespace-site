import db from "../../../db";
import { QueryResult } from "pg";
import { Label } from "../../types";

const labelResolvers = {
  Query: {},
  Mutation: {
    createLabel: async (
      _: null,
      { catalogue_id, name }: { catalogue_id: string; name: string }
    ) => {
      const newLabelRes: QueryResult<Label> = await db.query(
        "INSERT INTO labels (catalogue_id, name) VALUES ($1, $2) RETURNING *",
        [catalogue_id, name]
      );
      const newLabel: Label = newLabelRes.rows[0];
      return newLabel;
    },
  },
  Subscription: {},
};

export default labelResolvers;
