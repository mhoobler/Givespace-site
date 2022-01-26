import jwt from "jsonwebtoken";
import * as path from "path";
import { finished } from "stream/promises";
import * as fs from "fs";

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
  console.log("file", file);
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
