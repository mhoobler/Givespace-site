import db from "../../../db";
import { QueryResult } from "pg"
import { Label } from "../../types";


const labelResolvers = {
  Query: {},
  Mutation: {
    createLabel: async (
      _: null,
      args: {id: string},
    ) {
      const newLabel: QueryResult<Label> = await db.query(
    }
  },
  Subscription: {},
}