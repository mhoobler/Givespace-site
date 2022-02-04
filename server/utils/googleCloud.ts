import * as path from "path";
const Cloud = require("@google-cloud/storage");

const serviceKeyPath = path.join(__dirname, "../bucket-key.json");
const { Storage } = Cloud;
const storage = new Storage({
  keyFilename: serviceKeyPath,
  projectId: process.env.GC_PROJECT_ID,
});
const bucket = storage.bucket(process.env.GC_BUCKET_ID);

export const deleteFromGC = async (fileName: string, _ = "") => {
  const fileToDelete = await bucket.file(fileName);
  await fileToDelete.delete();
  return "deleted";
};

export const uploadToGC = async (fileName: string, path: string) => {
  await bucket.upload(path, { destination: fileName });
  const publicUrl = `https://storage.googleapis.com/${process.env.GC_BUCKET_ID}/${fileName}`;
  return publicUrl;
};
