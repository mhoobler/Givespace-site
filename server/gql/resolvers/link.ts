import db from "../../db";
import { QueryResult } from "pg";
import { Link, Listing } from "../../types";
import {
  extractDomain,
  listingIdToCatalogueId,
  notExist,
  publishCatalogue,
} from "../../utils/functions";
import { urlValidation } from "../../utils/validation";

const linkResolvers = {
  Query: {},
  Mutation: {
    createLink: async (
      _: null,
      { listing_id, url }: { listing_id: string; url: string }
    ) => {
      urlValidation(url);

      const getListing: QueryResult<Listing> = await db.query(
        `SELECT catalogue_id FROM listings WHERE id = $1`,
        [listing_id]
      );
      notExist("Listing", getListing.rows[0]);
      // get only the domain name

      // cleaning up the url
      const title = extractDomain(url);

      const newLinkRes: QueryResult<Link> = await db.query(
        "INSERT INTO links (listing_id, url, title) VALUES ($1, $2, $3) RETURNING *",
        [listing_id, url, title]
      );
      const newLink: Link = newLinkRes.rows[0];

      publishCatalogue(getListing.rows[0].catalogue_id);

      return newLink;
    },
    deleteLink: async (_: null, { id }: { id: string }): Promise<Link> => {
      const deletedLinkRes: QueryResult<Link> = await db.query(
        "DELETE FROM links WHERE id = $1 RETURNING *",
        [id]
      );
      const deletedLink: Link = deletedLinkRes.rows[0];
      notExist("Link", deletedLink);

      listingIdToCatalogueId(deletedLinkRes.rows[0].listing_id).then(
        (catalogue_id) => publishCatalogue(catalogue_id)
      );

      return deletedLink;
    },
    editLink: async (
      _,
      { key, value, id }: { key: string; value: string; id: string }
    ): Promise<Link> => {
      if (!value) value = null;
      if (key === "url") {
        urlValidation(value);
      }

      const editedLinkRaw: QueryResult<Link> = await db.query(
        `UPDATE links SET ${key} = $1 WHERE id = $2 RETURNING *`,
        [value, id]
      );
      notExist("Link", editedLinkRaw.rows[0]);

      listingIdToCatalogueId(editedLinkRaw.rows[0].listing_id).then(
        (catalogue_id) => publishCatalogue(catalogue_id)
      );

      return editedLinkRaw.rows[0];
    },
  },
  Subscription: {},
};

export default linkResolvers;
