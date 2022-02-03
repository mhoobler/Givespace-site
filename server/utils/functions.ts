import jwt from "jsonwebtoken";
import * as path from "path";
import { finished } from "stream/promises";
import * as fs from "fs";
import { QueryResult } from "pg";
import { Catalogue } from "../types";
import db from "../db";
import { pubsub } from "../gql/index";
import { UserInputError } from "apollo-server-express";
import { deleteFromGC } from "./googleCloud";

export const verifyToken = (token: string): Boolean => {
  try {
    const decoded = jwt.verify(
      token.split("bearer ")[1],
      process.env.JWT_SECRET
    );
    return true;
  } catch (err) {
    throw new Error("Not authorized");
    return false;
  }
};

export const handleFile = async (
  file: any,
  callback: (fileName: string, path: string) => Promise<any>
): Promise<any> => {
  // creates the file locally, runs the callback, then deletes the file
  const { createReadStream, filename, mimetype, encoding } = await file;
  const stream = createReadStream();
  const pathToFile = path.join(__dirname, "../images/", filename);
  const out = fs.createWriteStream(pathToFile);
  stream.pipe(out);
  await finished(out);
  const callbackReturn = await callback(filename, pathToFile);
  await fs.promises.unlink(pathToFile);

  return callbackReturn;
};

export const getFullCatalogues = async (
  keyValue: string,
  key?: string
): Promise<Catalogue[]> => {
  const fullCatalogues: QueryResult<Catalogue> = await db.query(
    `SELECT 
      c.*,
      json_agg(DISTINCT la.*) as labels,
      json_agg(DISTINCT li.*) as listings
    FROM catalogues c 
    LEFT JOIN labels la ON c.id = la.catalogue_id
    LEFT JOIN listings li ON c.id = li.catalogue_id
    WHERE c.${key || "id"} = $1 GROUP BY c.id;`,
    [keyValue]
  );
  notExist("Catalogue", fullCatalogues.rows[0]);

  return fullCatalogues.rows;
};

export const publishCatalogue = async (
  catalogue_id: string
): Promise<Catalogue> => {
  const fullCatalogue: Catalogue = (await getFullCatalogues(catalogue_id))[0];

  pubsub.publish("CATALOGUE_EDITED", {
    liveCatalogue: fullCatalogue,
  });
  return fullCatalogue;
};

export const notExist = (whatText: string, res: any): void => {
  if (!res) {
    throw new UserInputError(`${whatText} does not exist`);
  }
};

export const maxOrdering = (list: any[]): number => {
  if (!list[0]) return 0;
  return list.reduce(
    // @ts-ignore
    (max, listing) => Math.max(max, listing.ordering),
    list[0].ordering
  );
};

export const deleteFileIfNotUsed = async (url) => {
  const cataloguesWithUrl = await db.query(
    "SELECT * FROM catalogues WHERE header_image_url = $1 OR profile_picture_url = $1;",
    [url]
  );
  const listingsWithUrl = await db.query(
    "SELECT * FROM listings WHERE image_url = $1;",
    [url]
  );
  const isUsedCount =
    listingsWithUrl.rows.length + cataloguesWithUrl.rows.length;
  const bucketUrl = `https://storage.googleapis.com/${process.env.GC_BUCKET_ID}/`;
  if (isUsedCount === 1 && url.includes(bucketUrl)) {
    const splitUrl = url.split("/");
    const fileName = splitUrl[splitUrl.length - 1];
    try {
      await deleteFromGC(fileName);
      return true;
    } catch (e) {
      console.log("File to delete does not exist: ", e);
    }
  }
  return false;
};
