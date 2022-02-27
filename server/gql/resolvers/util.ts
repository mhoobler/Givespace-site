import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../index";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import {
  Resolver,
  Context,
  Catalogue,
  Label,
  Listing,
  Link,
} from "../../types";
import { finished } from "stream/promises";
import * as path from "path";
import { uploadToGC } from "../../utils/googleCloud";
import { handleFile } from "../../utils/functions";
import { QueryResult } from "pg";
import db from "../../db";
import { createListing } from "./helperFunctions";
import { UserInputError } from "apollo-server-express";
const Cloud = require("@google-cloud/storage");

const serviceKeyPath = path.join(__dirname, "../../bucket-key.json");
const { Storage } = Cloud;
const GC_PROJECT_ID = "givespace";
const GC_BUCKET_ID = "givespace-pictures";
const storage = new Storage({
  keyFilename: serviceKeyPath,
  projectId: GC_PROJECT_ID,
});
const bucket = storage.bucket(GC_BUCKET_ID);

const userResolvers = {
  Query: {
    getJwt: (_: undefined, args: undefined, context: Context): String => {
      if (context.authToken) {
        return context.authToken;
      } else {
        const newAuthToken = "bearer " + jwt.sign({}, process.env.JWT_SECRET);
        return newAuthToken;
      }
    },
  },
  Mutation: {
    singleUpload: async (_, { file }) => {
      console.log("file", file);
      const { createReadStream, filename, mimetype, encoding } = await file;
      // const stream = createReadStream();
      // const pathName = path.join(__dirname, "../../images/", filename);
      // const out = require("fs").createWriteStream(pathName);
      // stream.pipe(out);
      // console.log("before");
      // await finished(out);
      // console.log("after");

      // await bucket.upload(pathName, { destination: filename });
      // console.log("uploaded");
      // const publicUrl = `https://storage.googleapis.com/${GC_BUCKET_ID}/${filename}`;

      const url = await handleFile(file, uploadToGC);

      console.log("url", url);

      return { filename, mimetype, encoding };
    },
    catalogueMacro: async (
      _: null,
      { catalogue }: { catalogue: Catalogue } // very similar to type Catalogue BUT NOT THE SAME
    ): Promise<String> => {
      // extract catalogue fields into an array of tuples
      let processedCatalogue = { ...catalogue };
      const listings = processedCatalogue.listings;
      delete processedCatalogue.listings;
      const labels = processedCatalogue.labels;
      delete processedCatalogue.labels;
      const catalogueFields = Object.entries(processedCatalogue);

      // create a new catalogue with dynamic fields
      const catalogueQuery = `INSERT INTO catalogues (user_id, ${catalogueFields
        .map((field) => field[0])
        .join(",")}) VALUES ($1, ${catalogueFields
        .map((_, idx) => `$${idx + 2}`)
        .join(",")}) RETURNING *`;
      const newCatalogueRaw: QueryResult<Catalogue> = await db.query(
        catalogueQuery,
        [
          "6a3a2967-0258-4caf-8fef-f844c060b2f2",
          ...catalogueFields.map((field) => field[1]),
        ]
      );
      const newCatalogue: Catalogue = newCatalogueRaw.rows[0];

      // create catalogue labels
      // labels must be uniform in shape
      let newLabels: Label[] | null;
      if (labels) {
        const labelsFields = Object.entries(labels[0]);
        const labelsQuery = `INSERT INTO labels (catalogue_id, ${labelsFields
          .map((field) => field[0])
          .join(",")}
        ) VALUES ${labels
          .map(
            (label: Label) =>
              `('${newCatalogue.id}', ${Object.entries(label)
                .map((labelField) => `'${labelField[1]}'`)
                .join(",")})`
          )
          .join(",")} RETURNING *`;
        const newLabelsRaw: QueryResult<Label> = await db.query(labelsQuery);
        newLabels = newLabelsRaw.rows;
      }

      // create catalogue listings
      const listingProcess = async (listing: Listing, labels?: Label[]) => {
        const processedListing = { ...listing };
        const listingLinks = processedListing.links;
        delete processedListing.links;
        const listingLabels = processedListing.labels;
        delete processedListing.labels;

        // create base listing
        const listingFields = Object.entries(processedListing);
        const createdListing = await createListing(
          listing.link_url || listing.name,
          newCatalogue,
          Boolean(listingLinks)
        );
        const listingExplicitQuery = `UPDATE listings SET ${listingFields
          .map((field, idx) => `${field[0]} = $${idx + 1}`)
          .join(",")} WHERE id = '${createdListing.id}' RETURNING *`;
        const listingExplicitRaw: QueryResult<Listing> = await db.query(
          listingExplicitQuery,
          [...listingFields.map((field) => field[1])]
        );
        const listingExplicit: Listing = listingExplicitRaw.rows[0];

        // create listing links
        // links must be uniform in shape
        if (listingLinks) {
          const linksFields = Object.entries(listingLinks[0]);
          const linksQuery = `INSERT INTO links (listing_id, ${linksFields
            .map((field) => field[0])
            .join(",")}
          ) VALUES ${listingLinks
            .map(
              (link: Link) =>
                `('${listingExplicit.id}', ${Object.entries(link)
                  .map((linkField) => `'${linkField[1]}'`)
                  .join(",")})`
            )
            .join(",")} RETURNING *`;
          const newLinksRaw: QueryResult<Label> = await db.query(linksQuery);
          const newLinks: Label[] = newLinksRaw.rows;
        }

        // create listing labels
        if (listingLabels && labels) {
          if (
            listingLabels.find(
              (ll: any) =>
                !labels.map((label) => label.name).includes(ll.label_name)
            )
          ) {
            throw new UserInputError(
              "Listing labels must be in catalogue labels"
            );
          }
          const labelsQuery = `INSERT INTO listing_labels (listing_id, label_id) VALUES ${listingLabels
            .map(
              (label: any) =>
                `('${listingExplicit.id}', '${
                  labels.find((l) => l.name === label.label_name).id
                }')`
            )
            .join(",")} RETURNING *`;
          const newListingLabelsRaw: QueryResult<Label> = await db.query(
            labelsQuery
          );
          const newListingLabels: Label[] = newListingLabelsRaw.rows;
        }
      };
      if (listings) {
        for (let listing of listings) {
          await listingProcess(listing, newLabels);
        }
      }

      return "http://localhost:4000/ctg/" + newCatalogue.id;
    },
  },
  Subscription: {},
};

export default userResolvers;
