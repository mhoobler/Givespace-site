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
import {
  CatalogueListItem,
  Catalogue,
  Context,
  CatalogueTruncated,
} from "../../types";
import db from "../../db";
import { QueryResult } from "pg";
import { deleteFromGC, uploadToGC } from "../../utils/googleCloud";
import { UserInputError } from "apollo-server-express";
import { fullCatalogueQuery, myCataloguesQuery } from "../../utils/sqlQueries";
import ColorThief from "color-thief-jimp";
import Jimp from "jimp";

const catalogueResolvers = {
  Query: {
    catalogues: async (
      _: null,
      args: { id: string; edit_id: string }
    ): Promise<Catalogue[]> => {
      let catalogues: Catalogue[];

      if (args.id) {
        catalogues = await getFullCatalogues(args.id);
      } else if (args.edit_id) {
        catalogues = await getFullCatalogues(args.edit_id, "edit_id");
      } else {
        const res = await db.query(fullCatalogueQuery());
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
        myCataloguesQuery(`WHERE c.user_id = '${authorization}' GROUP BY c.id`)
      );
      return catalogues.rows;
    },
  },

  Mutation: {
    createCatalogue: async (
      _: null,
      __: null,
      context: Context
    ): Promise<CatalogueTruncated> => {
      // lazy solution to get the joined catalogue
      const newCataloguesRes: QueryResult<CatalogueTruncated> = await db.query(
        "INSERT INTO catalogues (user_id) VALUES ($1) RETURNING *",
        [context.authorization]
      );
      const newCatalogue: CatalogueTruncated = newCataloguesRes.rows[0];

      notExist("Catalogue", newCatalogue);

      return newCatalogue;
    },
    deleteCatalogue: async (
      _,
      { id }: { id: string },
      context: Context
    ): Promise<CatalogueTruncated> => {
      // wheree id = $1 AND user_id = $2
      const deletedCatalogues: QueryResult<CatalogueTruncated> = await db.query(
        "DELETE FROM catalogues WHERE id = $1 AND user_id = $2 RETURNING id, edit_id, user_id, status, title, description, created, updated",
        [id, context.authorization]
      );
      const deletedCatalogue: CatalogueTruncated = deletedCatalogues.rows[0];

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
      if (!value) value = null;
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
      const callback = async (
        fileName: string,
        path: string
      ): Promise<string> => {
        // get the extension from path
        if (
          preResult.rows[0].header_color === "#000000" &&
          key === "header_image_url"
        ) {
          const dominantColor: string | null = await new Promise(
            (resolve, reject) => {
              Jimp.read(path, (err, sourceImage) => {
                if (err) {
                  reject(null);
                } else {
                  const rgb = ColorThief.getColor(sourceImage);
                  // transform rgb to hex
                  const hex = `#${rgb[0].toString(16)}${rgb[1].toString(
                    16
                  )}${rgb[2].toString(16)}`;
                  resolve(hex);
                }
              });
            }
          );
          if (!dominantColor) throw new UserInputError("Could not get color");
          await db.query(
            `UPDATE catalogues SET header_color = $1 WHERE id = $2 RETURNING *`,
            [dominantColor, id]
          );
        }

        const url: string = await uploadToGC(fileName, path);
        return url;
      };
      const url = await handleFile(file, callback);

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
