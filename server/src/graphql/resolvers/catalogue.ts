import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../index";
import {
  getFullCatalogue,
  handleFile,
  verifyToken,
} from "../../utils/functions";
import { CatalogueListItem, Catalogue, Context } from "../../types";
import db from "../../../db";
import { QueryResult } from "pg";
import { deleteFromGC, uploadToGC } from "../../utils/googleCloud";

// type EditCataloguesFields = {
//   id: string;
//   title: string;
// };

const catalogueResolvers = {
  Query: {
    catalogues: async (
      _: null,
      args: { id: string; edit_id: string }
    ): Promise<Catalogue[]> => {
      let catalogues: QueryResult<Catalogue>;

      if (args.id) {
        catalogues = await db.query(
          `SELECT 
            c.*,
            json_agg(l) as labels
          from catalogues c JOIN labels l on c.id = l.catalogue_id WHERE c.id = $1 GROUP BY c.id;`,
          [args.id]
        );
      } else if (args.edit_id) {
        catalogues = await db.query(
          `SELECT 
            c.*,
            json_agg(l) as labels
          from catalogues c JOIN labels l on c.id = l.catalogue_id WHERE c.edit_id = $1 GROUP BY c.id;`,
          [args.edit_id]
        );
      } else {
        catalogues = await db.query(
          `SELECT 
            c.*,
            json_agg(l) as labels
          from catalogues c LEFT JOIN labels l on c.id = l.catalogue_id GROUP BY c.id;`
        );
      }

      return catalogues.rows;
    },

    myCatalogues: async (
      _: null,
      __: null,
      { authorization }: Context
    ): Promise<CatalogueListItem[]> => {
      const catalogues: QueryResult<CatalogueListItem> = await db.query(
        `SELECT 
          c.*,
          json_agg(l) as labels
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
      const newCatalogues: QueryResult<Catalogue> = await db.query(
        "INSERT INTO catalogues (user_id) VALUES ($1) RETURNING *",
        [context.authorization]
      );
      const fullCatalogues: QueryResult<Catalogue> = await db.query(
        `SELECT 
          c.*,
          json_agg(l) as labels
        from catalogues c LEFT JOIN labels l on c.id = l.catalogue_id WHERE c.id = $1 GROUP BY c.id;`,
        [newCatalogues.rows[0].id]
      );
      const newCatalogue: Catalogue = await getFullCatalogue(
        fullCatalogues.rows[0].id
      );

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
      if (!deletedCatalogue) {
        throw new Error("Catalogue does not exist");
      }

      return deletedCatalogue;
    },
    incrementCatalogueViews: async (
      _,
      { id, edit_id }: { id: string; edit_id: string }
    ): Promise<Catalogue> => {
      if (!id && !edit_id) {
        throw new Error("No id or edit_id provided");
      }

      // lazy solution to get the joined catalogue
      const result: QueryResult<Catalogue> = await db.query(
        `UPDATE catalogues SET views = views + 1 WHERE ${
          id ? "id" : "edit_id"
        } = $1 RETURNING *`,
        [id || edit_id]
      );

      if (!result.rows[0]) {
        throw new Error("Catalogue does not exist");
      }

      const catalogue: Catalogue = await getFullCatalogue(result.rows[0].id);

      pubsub.publish("CATALOGUE_EDITED", {
        liveCatalogue: catalogue,
      });

      return catalogue;
    },
    editCatalogue: async (
      _,
      { key, value, id }: { key: string; value: string; id: string }
    ): Promise<Catalogue> => {
      const result: QueryResult<Catalogue> = await db.query(
        `UPDATE catalogues SET ${key} = $1 WHERE id = $2 RETURNING *`,
        [value, id]
      );

      if (!result.rows[0]) {
        throw new Error("Catalogue does not exist");
      }

      const catalogue: Catalogue = await getFullCatalogue(result.rows[0].id);

      pubsub.publish("CATALOGUE_EDITED", {
        liveCatalogue: catalogue,
      });

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
      console.log("preResult.rows[0]", preResult.rows[0]);
      // need to not run this if we are going to add placeholders
      if (preResult && preResult.rows && preResult.rows[0][key]) {
        const splitUrl = preResult.rows[0][key].split("/");
        const fileName = splitUrl[splitUrl.length - 1];
        try {
          await deleteFromGC(fileName);
          console.log("deleted from gc");
        } catch (e) {
          console.log("File to delete does not exist: ", e);
        }
      }

      const url = await handleFile(file, uploadToGC);

      const result: QueryResult<Catalogue> = await db.query(
        `UPDATE catalogues SET ${key} = $1 WHERE id = $2 RETURNING *`,
        [url, id]
      );

      const catalogue: Catalogue = await getFullCatalogue(result.rows[0].id);
      if (!catalogue) {
        throw new Error("Catalogue does not exist");
      }

      pubsub.publish("CATALOGUE_EDITED", {
        liveCatalogue: catalogue,
      });

      return catalogue;
    },

    // updateCatalogue: async (
    //   _: null,
    //   args: EditCataloguesFields,
    //   _context: Context,
    // ): Promise<Catalogue> => {
    //   const updatedCatalogue: QueryResult<Catalogue> = await db.query(
    //     "UPDATE catalogues SET title = $1 WHERE id = $2 RETURNING *",
    //     [args.title, args.id],
    //   );
    //   if (updatedCatalogue.rowCount === 0) {
    //     throw new Error("Could not edit catalogue");
    //   }

    //   console.log("updatedCatalogue", updatedCatalogue);
    //   return updatedCatalogue.rows[0];
    // },
  },
  Subscription: {
    liveCatalogue: {
      // all pubsub publish events under "CATALOGUE_EDITED" must return all fields...
      // required by this subscription
      subscribe: withFilter(
        () => pubsub.asyncIterator("CATALOGUE_EDITED"),
        (payload, variables) => {
          if (!variables.id && !variables.edit_id) {
            throw new Error("No id or edit_id provided");
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
