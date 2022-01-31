import jwt from "jsonwebtoken";
import * as path from "path";
import { finished } from "stream/promises";
import * as fs from "fs";
import { QueryResult } from "pg";
import { Catalogue } from "../types";
import db from "../../db";

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
  if (!fullCatalogues.rows[0]) {
    throw new Error("No catalogues returned");
  }

  return fullCatalogues.rows;
};
