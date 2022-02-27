import db from "../../db";
import { QueryResult } from "pg";
import { Catalogue, Link, Listing, ScrapedFeatures } from "types";
import {
  endOrdering,
  extractDomain,
  notExist,
  publishCatalogue,
} from "../../utils/functions";
import scrapeItemFeatures from "../../scraping/init";

export const createListing = async (
  name: string,
  fullCatalogue: Catalogue,
  ignore_link?: boolean
): Promise<Listing> => {
  const catalogue_id = fullCatalogue.id;
  const isUrl = name.slice(0, 8) === "https://";

  let newListingRes: QueryResult<Listing>;
  if (isUrl) {
    newListingRes = await db.query(
      "INSERT INTO listings (catalogue_id, ordering) VALUES ($1, $2) RETURNING *",
      [catalogue_id, endOrdering(fullCatalogue.listings, "min") - 1]
    );
  } else {
    newListingRes = await db.query(
      "INSERT INTO listings (catalogue_id, name, ordering) VALUES ($1, $2, $3) RETURNING *",
      [catalogue_id, name, endOrdering(fullCatalogue.listings, "min") - 1]
    );
  }

  let newListing: Listing = newListingRes.rows[0];

  if (isUrl && !ignore_link) {
    const title = extractDomain(name);
    const newLisnkRes: QueryResult<Link> = await db.query(
      "INSERT INTO links (listing_id, url, title) VALUES ($1, $2, $3) RETURNING *",
      [newListing.id, name, title]
    );
    newListing = { ...newListing, links: [newLisnkRes.rows[0]] };
  }

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
    let updatedListing: Listing = updateListingRes.rows[0];
    notExist("Listing", updatedListing);

    if (!isUrl && !ignore_link) {
      const title = extractDomain(features.item_url);
      const newLisnkRes: QueryResult<Link> = await db.query(
        "INSERT INTO links (listing_id, url, title) VALUES ($1, $2, $3) RETURNING *",
        [updatedListing.id, features.item_url, title]
      );
      updatedListing = {
        ...updatedListing,
        links: currentListing.links
          ? [...currentListing.links, newLisnkRes.rows[0]]
          : [newLisnkRes.rows[0]],
      };
    }

    publishCatalogue(catalogue_id);
  };
  scrapeData();
  return newListing;
};
