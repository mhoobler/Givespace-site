import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../index";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import { Resolver, Context } from "../../types";
import { finished } from "stream/promises";
import * as path from "path";
import { uploadToGC } from "../../utils/googleCloud";
import { handleFile } from "../../utils/functions";
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
  },
  Subscription: {},
};

export default userResolvers;
