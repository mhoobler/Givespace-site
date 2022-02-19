import db from "../../db";
import { QueryResult } from "pg";
import { ScrapedFeatures, Catalogue, Label, Listing } from "../../types";
import {
  deleteFileIfNotUsed,
  getFullCatalogues,
  handleFile,
  maxOrdering,
  notExist,
  publishCatalogue,
} from "../../utils/functions";
import { pubsub } from "../index";
import scrapeItemFeatures from "../../scraping/init";
import { uploadToGC } from "../../utils/googleCloud";
import { fullListingQuery } from "../../utils/sqlQueries";

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

      const isUrl = name.slice(0, 8) === "https://";

      notExist("Catalogue", fullCatalogue);

      let newListingRes: QueryResult<Listing>;
      if (isUrl) {
        newListingRes = await db.query(
          "INSERT INTO listings (catalogue_id, ordering) VALUES ($1, $2) RETURNING *",
          [catalogue_id, maxOrdering(fullCatalogue.listings) + 1]
        );
      } else {
        newListingRes = await db.query(
          "INSERT INTO listings (catalogue_id, name, ordering) VALUES ($1, $2, $3) RETURNING *",
          [catalogue_id, name, maxOrdering(fullCatalogue.listings) + 1]
        );
      }

      const newListing: Listing = newListingRes.rows[0];

      publishCatalogue(catalogue_id);

      const scrapeData = async () => {
        const features: ScrapedFeatures = await scrapeItemFeatures(name);

        const currentListingRes: QueryResult<Listing> = await db.query(
          "SELECT * FROM listings WHERE id = $1",
          [newListing.id]
        );
        const currentListing: Listing = currentListingRes.rows[0];

        const updateListingRes: QueryResult<Listing> = await db.query(
          "UPDATE listings SET image_url = $1, price = $2, name = $3, description = $4 WHERE id = $5 RETURNING *",
          [
            // if none of the following exist yet replace with scrape data
            currentListing.image_url || features.image_url,
            currentListing.price || features.price,
            currentListing.name || features.name,
            currentListing.description || features.description,
            newListing.id,
          ]
        );
        const updatedListing: Listing = updateListingRes.rows[0];
        notExist("Listing", updatedListing);

        publishCatalogue(catalogue_id);
      };
      scrapeData();

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
      const updatedListing: Listing = updatedListingRes.rows[0];
      notExist("Listing", updatedListing);

      publishCatalogue(updatedListing.catalogue_id);

      return updatedListing;
    },
  },
  Subscription: {},
};

export default listingResolvers;
