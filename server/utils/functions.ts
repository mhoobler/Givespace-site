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
import { fullCatalogueQuery } from "./sqlQueries";

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
  try {
    const { createReadStream, filename, mimetype, encoding } = await file;
    const pathToFile = path.join(__dirname, "../images/", filename);

    const stream = createReadStream();
    await new Promise((resolve, reject) =>
      stream
        .on("error", (error) => {
          fs.promises.unlink(pathToFile);
          reject(error);
        })
        .pipe(fs.createWriteStream(pathToFile))
        .on("error", (error) => {
          fs.promises.unlink(pathToFile);
          reject(error);
        })
        .on("finish", () => {
          resolve("done");
        })
    );
    const callbackReturn = await callback(filename, pathToFile);
    await fs.promises.unlink(pathToFile);

    return callbackReturn;
    // return "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Bonnet_macaque_%28Macaca_radiata%29_Photograph_By_Shantanu_Kuveskar.jpg/220px-Bonnet_macaque_%28Macaca_radiata%29_Photograph_By_Shantanu_Kuveskar.jpg";
  } catch (err) {
    console.log(err);
    throw new UserInputError("File upload failed");
  }
};

export const getFullCatalogues = async (
  keyValue: string,
  key?: string
): Promise<Catalogue[]> => {
  const fullCatalogues: QueryResult<Catalogue> = await db.query(
    fullCatalogueQuery(`WHERE c.${key || "id"} = '${keyValue}'`)
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

export const notExist = (whatText: string, obj: any): void => {
  if (!obj) {
    throw new UserInputError(`${whatText} does not exist`);
  }
};

export const endOrdering = (list: any[] | null, type: string): number => {
  if (!list || (list && list.length === 0)) return 0;
  return list.reduce(
    // @ts-ignore
    (max, ins) => {
      if (type === "max") return Math.max(max, ins.ordering);
      if (type === "min") return Math.min(max, ins.ordering);
    },
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

export const listingIdToCatalogueId = async (
  listing_id: string
): Promise<string> => {
  const listingRes: QueryResult<{ catalogue_id: string }> = await db.query(
    `SELECT catalogue_id FROM listings WHERE id = $1`,
    [listing_id]
  );
  notExist("Listing", listingRes.rows[0]);
  return listingRes.rows[0].catalogue_id;
};

export const isUrl = (text: string): Boolean => {
  if (text.slice(0, 8) === "https://" || text.slice(0, 7) === "http://")
    return true;
  return false;
};
