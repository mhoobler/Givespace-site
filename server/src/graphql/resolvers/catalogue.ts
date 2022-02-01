import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../index";
import {
  deleteFileIfNotUsed,
  getFullCatalogues,
  handleFile,
  notExist,
  publishCatalogue,
  verifyToken,
} from "../../utils/functions";
import { CatalogueListItem, Catalogue, Context } from "../../types";
import db from "../../../db";
import { QueryResult } from "pg";
import { deleteFromGC, uploadToGC } from "../../utils/googleCloud";
import { UserInputError } from "apollo-server-express";

const catalogueResolvers = {
  Query: {
    catalogues: async (
      _: null,
      args: { id: string; edit_id: string }
    ): Promise<Catalogue[]> => {
      if (!args.id && !args.edit_id) {
        throw new UserInputError("No id or edit_id provided");
      }

      let catalogues: Catalogue[];

      if (args.id) {
        catalogues = await getFullCatalogues(args.id);
      } else if (args.edit_id) {
        catalogues = await getFullCatalogues(args.edit_id, "edit_id");
      } else {
        const res = await db.query(
          `SELECT 
            c.*,
            json_agg(DISTINCT la.*) as labels,
            json_agg(DISTINCT li.*) as listings
          FROM catalogues c 
          LEFT JOIN labels la ON c.id = la.catalogue_id
          LEFT JOIN listings li ON c.id = li.catalogue_id
          GROUP BY c.id;`
        );
        catalogues = res.rows;
      }

      return catalogues;
    },

    myCatalogues: async (
      _: null,
      __: null,
      { authorization }: Context
    ): Promise<CatalogueListItem[]> => {
      const catalogues: QueryResult<CatalogueListItem> = await db.query(
        `SELECT 
          c.*,
          json_agg(l ORDER BY ordering) as labels
        from catalogues c LEFT JOIN labels l on c.id = l.catalogue_id WHERE c.user_id = $1 GROUP BY c.id;`,
        [authorization]
      );
      return catalogues.rows;
    },
  },

  Mutation: {
    createCatalogue: async (
      _: null,
      __: null,
      context: Context
    ): Promise<Catalogue> => {
      // lazy solution to get the joined catalogue
      const newCataloguesRes: QueryResult<{ id: string }> = await db.query(
        "INSERT INTO catalogues (user_id) VALUES ($1) RETURNING id",
        [context.authorization]
      );
      const newCatalogue: Catalogue = (
        await getFullCatalogues(newCataloguesRes.rows[0].id)
      )[0];

      return newCatalogue;
    },
    deleteCatalogue: async (
      _,
      { id }: { id: string },
      context: Context
    ): Promise<CatalogueListItem> => {
      // wheree id = $1 AND user_id = $2
      const deletedCatalogues: QueryResult<CatalogueListItem> = await db.query(
        "DELETE FROM catalogues WHERE id = $1 AND user_id = $2 RETURNING id, edit_id, user_id, status, title, description, created, updated",
        [id, context.authorization]
      );
      const deletedCatalogue: CatalogueListItem = deletedCatalogues.rows[0];

      notExist("Catalogue", deletedCatalogue);

      return deletedCatalogue;
    },
    incrementCatalogueViews: async (
      _,
      { id, edit_id }: { id: string; edit_id: string }
    ): Promise<Catalogue> => {
      if (!id && !edit_id) {
        throw new UserInputError("No id or edit_id provided");
      }

      // lazy solution to get the joined catalogue
      // first query to make the change and get id
      const result: QueryResult<Catalogue> = await db.query(
        `UPDATE catalogues SET views = views + 1 WHERE ${
          id ? "id" : "edit_id"
        } = $1 RETURNING *`,
        [id || edit_id]
      );

      notExist("Catalogue", result.rows[0]);

      // second query to get the full catalogue
      const catalogue = await publishCatalogue(result.rows[0].id);

      return catalogue;
    },
    editCatalogue: async (
      _,
      { key, value, id }: { key: string; value: string; id: string }
    ): Promise<Catalogue> => {
      const updatedCatalogueRes: QueryResult<Catalogue> = await db.query(
        `UPDATE catalogues SET ${key} = $1 WHERE id = $2 RETURNING *`,
        [value, id]
      );

      notExist("Catalogue", updatedCatalogueRes.rows[0]);

      const catalogue = await publishCatalogue(id);

      return catalogue;
    },
    editCatalogueFile: async (
      _,
      { id, key, file }: { id: string; key: string; file: any }
    ) => {
      let preResult: QueryResult<Catalogue> = await db.query(
        "SELECT * FROM catalogues WHERE id = $1",
        [id]
      );

      notExist("Catalogue", preResult.rows[0]);

      // need to not run this if we are going to add placeholders
      if (preResult.rows[0][key]) {
        // TODO: test and optimize so that it does not need the await
        await deleteFileIfNotUsed(preResult.rows[0][key]);
      }

      const url = await handleFile(file, uploadToGC);

      const updatedCatalogueRes: QueryResult<Catalogue> = await db.query(
        `UPDATE catalogues SET ${key} = $1 WHERE id = $2 RETURNING *`,
        [url, id]
      );

      const catalogue = await publishCatalogue(updatedCatalogueRes.rows[0].id);

      return catalogue;
    },
  },
  Subscription: {
    liveCatalogue: {
      // all pubsub publish events under "CATALOGUE_EDITED" must return all fields...
      // required by this subscription
      subscribe: withFilter(
        () => pubsub.asyncIterator("CATALOGUE_EDITED"),
        (payload, variables) => {
          if (!variables.id && !variables.edit_id) {
            throw new UserInputError("No id or edit_id provided");
          }
          if (variables.id) {
            return payload.liveCatalogue.id === variables.id;
          } else {
            return payload.liveCatalogue.edit_id === variables.edit_id;
          }
        }
      ),
    },
  },
};

export default catalogueResolvers;
