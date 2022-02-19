const Cloud = require("@google-cloud/storage");

const { Storage } = Cloud;
const storage = new Storage({
  projectId: process.env.GC_PROJECT_ID,
  credentials: {
    type: process.env.GC_TYPE,
    project_id: process.env.GC_PROJECT_ID,
    private_key_id: process.env.GC_PRIVATE_KEY_ID,
    private_key: process.env.GC_PRIVATE_KEY,
    client_email: process.env.GC_CLIENT_EMAIL,
    client_id: process.env.GC_CLIENT_ID,
    auth_uri: process.env.GC_AUTH_URI,
    token_uri: process.env.GC_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GC_AUTH_CERT,
    client_x509_cert_url: process.env.GC_CLIENT_CERT,
  },
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
