import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../index";
import fetch from "node-fetch";
import { verifyToken } from "../../utils/functions";
import { Catalogues, Context } from "../../types";
import db from "../../../db";

type GetCataloguesFields = {
  id: string;
};

type EditCataloguesFields = {
  id: string;
  title: string;
};

const userResolvers = {
  Query: {
    catalogues: async (_, args: GetCataloguesFields) => {
      // please do the typing for "db" queries
      // for example this one should be (): Catalogues[] => {}
      // will likely involve typing return value "catalogues.rows"

      let catalogues;
      if (!args.id) {
        catalogues = await db.query("SELECT * FROM catalogues");
      } else {
        catalogues = await db.query("SELECT * FROM catalogues WHERE id = $1", [
          args.id,
        ]);
      }
      return catalogues.rows;
    },
    myCatalogues: async (_, __, { authToken }: Context) => {
      const catalogues = await db.query(
        "SELECT * FROM catalogues WHERE user_id = $1",
        [authToken]
      );
      return catalogues.rows;
    },
  },
  Mutation: {
    createUser: async (_, args, context: Context) => {
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
    createCatalogue: async (_, __, context: Context) => {
      // have this function return the catalogue that was just created
      // type the return as well

      const newCatalogue = await db.query(
        "INSERT INTO catalogues (title, description, user_id) VALUES ($1, $2, $3)",
        ["Untitled Catalogue", "Once upon a time...", context.authToken]
      );

      console.log("newCatalogue", newCatalogue);

      // return newCatalogue
      return {
        id: "delete me",
        title: "delete me",
        description: "delete me",
        user_id: "delete me",
      };
    },
    updateCatalogue: async (
      _,
      args: EditCataloguesFields,
      context: Context
    ) => {
      const updatedCatalogue = await db.query(
        "UPDATE catalogues SET title = $1 WHERE id = $2",
        [args.title, args.id]
      );
      if (updatedCatalogue.rowCount === 0) {
        throw new Error("Could not edit catalogue");
      }

      console.log("updatedCatalogue", updatedCatalogue);
      // return updatedCatalogue;
      return {
        id: "delete me",
        title: "delete me",
      };
    },
  },
  Subscription: {
    liveUsers: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("USER_CREATED"),
        (payload, variables) => {
          return payload.liveUsers.name.includes(variables.mustInclude);
        }
      ),
    },
  },
};

export default userResolvers;
