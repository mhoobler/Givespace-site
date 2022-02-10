import db from "../../db";
import { QueryResult } from "pg";
import { BasicListingLabel, Listing, ListingLabel } from "../../types";
import {
  listingIdToCatalogueId,
  notExist,
  publishCatalogue,
} from "../../utils/functions";
import { fullListingLabelQuery } from "../../utils/sqlQueries";

const listingLabelResolvers = {
  Query: {},
  Mutation: {
    createListingLabel: async (
      _: null,
      { listing_id, label_id }: { listing_id: string; label_id: string }
    ): Promise<ListingLabel> => {
      const getListing: QueryResult<Listing> = await db.query(
        `SELECT catalogue_id FROM listings WHERE id = $1`,
        [listing_id]
      );
      notExist("Listing", getListing.rows[0]);
      // get only the domain name

      const newBasicListingLabelRes: QueryResult<BasicListingLabel> =
        await db.query(
          "INSERT INTO listing_labels (listing_id, label_id) VALUES ($1, $2) RETURNING *",
          [listing_id, label_id]
        );
      const basicListingLabel: BasicListingLabel =
        newBasicListingLabelRes.rows[0];

      const newListingLabelRes: QueryResult<ListingLabel> = await db.query(
        fullListingLabelQuery(`WHERE lila.id = '${basicListingLabel.id}'`)
      );
      const newListingLabel: ListingLabel = newListingLabelRes.rows[0];
      notExist("ListingLabel", newListingLabel);

      publishCatalogue(getListing.rows[0].catalogue_id);

      return newListingLabel;
    },
    deleteListingLabel: async (
      _: null,
      { id }: { id: string }
    ): Promise<ListingLabel> => {
      const newListingLabelRes: QueryResult<ListingLabel> = await db.query(
        fullListingLabelQuery(`WHERE lila.id = '${id}'`)
      );
      const newListingLabel: ListingLabel = newListingLabelRes.rows[0];
      notExist("ListingLabel", newListingLabel);

      const deletedLinkRes: QueryResult<BasicListingLabel> = await db.query(
        "DELETE FROM listing_labels WHERE id = $1 RETURNING *",
        [id]
      );

      listingIdToCatalogueId(newListingLabel.listing_id).then((catalogue_id) =>
        publishCatalogue(catalogue_id)
      );

      return newListingLabel;
    },
  },
  Subscription: {},
};

export default listingLabelResolvers;
