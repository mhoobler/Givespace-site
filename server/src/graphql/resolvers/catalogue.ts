import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../index";
import { verifyToken } from "../../utils/functions";
import { CatalogueListItem, Catalogue, Context } from "../../types";
import db from "../../../db";
import { QueryResult } from "pg";

type GetCataloguesFields = {
  id: string;
};

type EditCataloguesFields = {
  id: string;
  title: string;
};

const userResolvers = {
  Query: {
    catalogues: async (
      _: null,
      args: GetCataloguesFields,
    ): Promise<Catalogue[]> => {
      let catalogues: QueryResult<Catalogue>;

      if (!args.id) {
        catalogues = await db.query("SELECT * FROM catalogues");
      } else {
        catalogues = await db.query("SELECT * FROM catalogues WHERE id = $1", [
          args.id,
        ]);
      }

      return catalogues.rows;
    },

    myCatalogues: async (
      _: null,
      __: null,
      { authToken }: Context,
    ): Promise<CatalogueListItem[]> => {
      const catalogues: QueryResult<CatalogueListItem> = await db.query(
        "SELECT (id, user_id, title, description, created, updated) FROM catalogues WHERE user_id = $1",
        [authToken],
      );
      return catalogues.rows;
    },
  },

  Mutation: {
    createUser: async (_: any, args: unknown, context: Context) => {
      verifyToken(context.authToken);
      const response = await fetch("http://localhost:3000/users", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(args),
      });
      const user = await response.json();
      pubsub.publish("USER_CREATED", { liveUsers: user });
      return user;
    },

    createCatalogue: async (
      _: null,
      __: null,
      context: Context,
    ): Promise<Catalogue> => {
      const newCatalogue: QueryResult<Catalogue> = await db.query(
        "INSERT INTO catalogues (title, description, user_id) VALUES ($1, $2, $3) RETURNING *",
        ["Untitled Catalogue", "Once upon a time...", context.authToken],
      );

      console.log("newCatalogue", newCatalogue);

      // return newCatalogue
      return newCatalogue.rows[0];
    },

    updateCatalogue: async (
      _: null,
      args: EditCataloguesFields,
      _context: Context,
    ): Promise<Catalogue> => {
      const updatedCatalogue: QueryResult<Catalogue> = await db.query(
        "UPDATE catalogues SET title = $1 WHERE id = $2 RETURNING *",
        [args.title, args.id],
      );
      if (updatedCatalogue.rowCount === 0) {
        throw new Error("Could not edit catalogue");
      }

      console.log("updatedCatalogue", updatedCatalogue);
      return updatedCatalogue.rows[0];
    },
  },

  Subscription: {
    liveUsers: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("USER_CREATED"),
        (payload, variables) => {
          return payload.liveUsers.name.includes(variables.mustInclude);
        },
      ),
    },
  },
};

export default userResolvers;
