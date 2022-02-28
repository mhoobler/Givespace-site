import db from "../../db";
import { QueryResult } from "pg";
import { ScrapedFeatures, Catalogue, Label, Listing, Link } from "../../types";
import {
  deleteFileIfNotUsed,
  getFullCatalogues,
  handleFile,
  endOrdering,
  notExist,
  publishCatalogue,
  extractDomain,
} from "../../utils/functions";
import { pubsub } from "../index";
import scrapeItemFeatures from "../../scraping/init";
import { uploadToGC } from "../../utils/googleCloud";
import { fullListingQuery } from "../../utils/sqlQueries";
import { createListing } from "./helperFunctions";

const listingResolvers = {
  Query: {},
  Mutation: {
    createListing: async (
      _: null,
      { catalogue_id, name }: { catalogue_id: string; name: string }
    ): Promise<Listing> => {
      const fullCatalogue: Catalogue = (
        await getFullCatalogues(catalogue_id)
      )[0];
      notExist("Catalogue", fullCatalogue);

      let newListing: Listing = await createListing(name, fullCatalogue);

      return newListing;
    },
    deleteListing: async (
      _: null,
      { id }: { id: string }
    ): Promise<Listing> => {
      const deletedListingRes: QueryResult<Listing> = await db.query(
        "DELETE FROM listings WHERE id = $1 RETURNING *",
        [id]
      );
      const deletedListing: Listing = deletedListingRes.rows[0];
      notExist("Listing", deletedListing);

      publishCatalogue(deletedListing.catalogue_id);

      return deletedListing;
    },
    editListing: async (
      _,
      { key, value, id }: { key: string; value: string; id: string }
    ): Promise<Listing> => {
      if (!value) value = null;
      const editedListingRaw: QueryResult<Listing> = await db.query(
        `UPDATE listings SET ${key} = $1 WHERE id = $2 RETURNING *`,
        [value, id]
      );

      notExist("Listing", editedListingRaw.rows[0]);

      publishCatalogue(editedListingRaw.rows[0].catalogue_id);

      const fullEditiedListing = await db.query(
        fullListingQuery(`WHERE li.id = '${id}'`)
      );
      notExist("Listing", fullEditiedListing.rows[0]);
      return fullEditiedListing.rows[0];
    },
    editListingFile: async (_, { id, file }: { id: string; file: any }) => {
      let preResult: QueryResult<Listing> = await db.query(
        "SELECT * FROM listings WHERE id = $1",
        [id]
      );

      notExist("Listing", preResult.rows[0]);

      // need to not run this if we are going to add placeholders
      if (preResult.rows[0].image_url) {
        // TODO: test and optimize so that it does not need the await
        await deleteFileIfNotUsed(preResult.rows[0].image_url);
      }

      const url = await handleFile(file, uploadToGC);

      const updatedListingRes: QueryResult<Listing> = await db.query(
        `UPDATE listings SET image_url = $1 WHERE id = $2 RETURNING *`,
        [url, id]
      );

      publishCatalogue(updatedListingRes.rows[0].catalogue_id);

      return updatedListingRes.rows[0];
    },
    reorderListing: async (
      _: null,
      { id, ordering }: { id: string; ordering: number }
    ): Promise<Listing> => {
      const updatedListingRes: QueryResult<Listing> = await db.query(
        "UPDATE listings SET ordering = $1 WHERE id = $2 RETURNING *",
        [ordering, id]
      );
      const updateQuery: QueryResult<Listing> = await db.query(
        fullListingQuery(`WHERE li.id = '${id}'`)
      );
      const updatedListing = updateQuery.rows[0];
      notExist("Listing", updatedListing);

      publishCatalogue(updatedListing.catalogue_id);

      return updatedListing;
    },
  },
  Subscription: {},
};

export default listingResolvers;
