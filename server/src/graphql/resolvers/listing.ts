import db from "../../../db";
import { QueryResult } from "pg";
import { Catalogue, Label, Listing, ScrapedFeatures } from "../../types";
import { getFullCatalogues } from "../../utils/functions";
import { pubsub } from "../index";
import scrapeItemFeatures from "../../utils/amazonScraper";

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
      if (!fullCatalogue) {
        throw new Error("No catalogue found");
      }
      console.log("fullCatalogue", fullCatalogue);
      // get the max ordering from fullCatalogue.listings
      const maxOrdering: any = fullCatalogue.listings.reduce(
        // @ts-ignore
        (max, listing) => Math.max(max, listing.ordering),
        0
      );
      const newListingRes: QueryResult<Listing> = await db.query(
        "INSERT INTO listings (catalogue_id, name, ordering) VALUES ($1, $2, $3) RETURNING *",
        [catalogue_id, name, maxOrdering + 1]
      );
      const newListing: Listing = newListingRes.rows[0];

      const newFullCatalogue: Catalogue = (
        await getFullCatalogues(catalogue_id)
      )[0];

      pubsub.publish("CATALOGUE_EDITED", {
        liveCatalogue: newFullCatalogue,
      });

      const scrapeData = async () => {
        const features: ScrapedFeatures = await scrapeItemFeatures(name);

        const currentListingRes: QueryResult<Listing> = await db.query(
          "SELECT * FROM listings WHERE id = $1",
          [newListing.id]
        );
        const currentListing: Listing = currentListingRes.rows[0];

        const updateListingRes: QueryResult<Listing> = await db.query(
          "UPDATE listings SET image_url = $1, price = $2 WHERE id = $3 RETURNING *",
          [
            currentListing.image_url || features.image_url,
            currentListing.price || features.price,
            newListing.id,
          ]
        );
        const updatedListing: Listing = updateListingRes.rows[0];

        console.log("updatedListing", updatedListing);

        const newFullCatalogue: Catalogue = (
          await getFullCatalogues(catalogue_id)
        )[0];
        pubsub.publish("CATALOGUE_EDITED", {
          liveCatalogue: newFullCatalogue,
        });
      };
      setTimeout(scrapeData, 10000);
      // scrapeData();

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
      if (!deletedListing) {
        throw new Error("Listing not found");
      }

      const fullCatalogue: Catalogue = (
        await getFullCatalogues(deletedListing.catalogue_id)
      )[0];

      pubsub.publish("CATALOGUE_EDITED", {
        liveCatalogue: fullCatalogue,
      });

      return deletedListing;
    },
    editListing: async (
      _,
      { key, value, id }: { key: string; value: string; id: string }
    ): Promise<Listing> => {
      const result: QueryResult<Listing> = await db.query(
        `UPDATE listings SET ${key} = $1 WHERE id = $2 RETURNING *`,
        [value, id]
      );

      if (!result.rows[0]) {
        throw new Error("Listing does not exist");
      }

      const catalogue: Catalogue = (
        await getFullCatalogues(result.rows[0].catalogue_id)
      )[0];

      pubsub.publish("CATALOGUE_EDITED", {
        liveCatalogue: catalogue,
      });

      return result.rows[0];
    },
    reorderListing: async (
      _: null,
      { id, ordering }: { id: string; ordering: number }
    ): Promise<Listing> => {
      console.log("START");
      const updatedListingRes: QueryResult<Listing> = await db.query(
        "UPDATE listings SET ordering = $1 WHERE id = $2 RETURNING *",
        [ordering, id]
      );
      const updatedListing: Listing = updatedListingRes.rows[0];
      console.log("updatedListing", updatedListing);
      const fullCatalogue: Catalogue = (
        await getFullCatalogues(updatedListing.catalogue_id)
      )[0];

      pubsub.publish("CATALOGUE_EDITED", {
        liveCatalogue: fullCatalogue,
      });

      return updatedListing;
    },
  },
  Subscription: {},
};

export default listingResolvers;
