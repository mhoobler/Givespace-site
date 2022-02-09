import db from "../../db";
import { QueryResult } from "pg";
import { Catalogue, Label, Link, Listing } from "../../types";
import {
  getFullCatalogues,
  maxOrdering,
  notExist,
  publishCatalogue,
} from "../../utils/functions";
import { getMetaItems } from "../../scraping/utils";

const linkResolvers = {
  Query: {},
  Mutation: {
    createLink: async (
      _: null,
      { listing_id, url }: { listing_id: string; url: string }
    ) => {
      const getListing: QueryResult<Listing> = await db.query(
        `SELECT catalogue_id FROM listings WHERE id = $1`,
        [listing_id]
      );
      notExist("Listing", getListing.rows[0]);
      // get only the domain name

      const title = url.split("/")[2].split(".")[1];
      const newLinkRes: QueryResult<Link> = await db.query(
        "INSERT INTO links (listing_id, url, title) VALUES ($1, $2, $3) RETURNING *",
        [listing_id, url, title]
      );
      const newLink: Link = newLinkRes.rows[0];

      publishCatalogue(getListing.rows[0].catalogue_id);

      return newLink;
    },
    // deleteLabel: async (_: null, { id }: { id: string }): Promise<Label> => {
    //   const deletedLabelRes: QueryResult<Label> = await db.query(
    //     "DELETE FROM labels WHERE id = $1 RETURNING *",
    //     [id]
    //   );
    //   const deletedLabel: Label = deletedLabelRes.rows[0];

    //   notExist("Label", deletedLabel);

    //   publishCatalogue(deletedLabel.catalogue_id);

    //   return deletedLabel;
    // },
    // reorderLabel: async (
    //   _: null,
    //   { id, ordering }: { id: string; ordering: number }
    // ): Promise<Label> => {
    //   const updatedLabelRes: QueryResult<Label> = await db.query(
    //     "UPDATE labels SET ordering = $1 WHERE id = $2 RETURNING *",
    //     [ordering, id]
    //   );
    //   const updatedLabel: Label = updatedLabelRes.rows[0];

    //   notExist("Label", updatedLabel);

    //   publishCatalogue(updatedLabelRes.rows[0].catalogue_id);

    //   return updatedLabel;
    // },
  },
  Subscription: {},
};

export default linkResolvers;
