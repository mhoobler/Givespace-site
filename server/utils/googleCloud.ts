const Cloud = require("@google-cloud/storage");

const { Storage } = Cloud;
const storage = new Storage({
  projectId: process.env.GC_PROJECT_ID,
  credentials: {
    type: "service_account",
    project_id: "givespace",
    private_key_id: "a3ffef2169f993b63ca6aa75cc27023ecff91d08",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDLt1OQqxOJGkK+\n8BSSztBciO7w9P07pSbJ1XIuduCezrLwBX1sKKqxLJLvf3nSDm1F5Ja4uAuFvror\nFLKtGY+HVpwFNae7cGhF2pYUxzit/vzNFjV2SLU2mLEOVOjEBMpVuUPJFNmbV4lA\ndSs3RPVygmRe4QXXlUwaxrcx8G05pjXNGz0yNPxJL2Bdbp/z5YUGvNj10TID1Ej0\nSclEylKJNrrSSUmUKxtF/4Eef7hWgsGl15BppioppCHmrMHs4yp1qRN9fVfe3gOA\nwEY28xhThFhxmkPmTuq8+LmIFJuSJB6Gr1kAnW0ssgMIh25CHbOoyZjhN2kyQZpz\nEFoxQ4DbAgMBAAECggEARvF+CYh6UimyCtqC36lkSIVraMB4m9fkzS8nB2Vgzg0/\npXTT++Ghp/fU59Dl9LAPf+KeVo/Je3czUCNyIfQf1srjpLDNy+nWdlUsJOpII9gD\n48wTLDEf4naEWnBZa0Ib0ISnRZScP4vZgXgMZ7/9Fjawi5YjubMFgOGpFJwc/ZDz\npsL5V7nrpvd6J+epjzEuWjGKiCfEvF/dal2t+G/IXsWbKsAVIN6vKNC5/Q0FNhun\nf9RvTTsYBLPYy8Pn6cYKkFw9l9e0k2ok0wZVq252qMVKRv1RJwtDqVe0G2UTVvD0\ny1XT2dfBaKTooR96s0xEhWdioQxun2DnFmTf8NctIQKBgQD7pJu3Gi6eO0Z/a884\n9fr+r3j3VLg/yA79vu6VZxsaUt77Ha0T33+xwA3I4T/6y54dhAa47xpKGUHxe4Er\nAyI8OIer1PzG9ZvE0tFBOuDmMtBcrdLLOA1/Lo34RsxYeMBpCha7yjTZ5vKTMMvu\nZYYuQwKylvV4yS5E1WndTX0GywKBgQDPPkkIGXJKb/+uVF2k/Q4qXtlQZez6TtUZ\nvWz3Vstl8q7+UxyCJgF6YFuvwwrW2Jq0ZvTkEVFMbm0kbql6j4yLaigf0F/acmXg\ntvva2I6tp738/tcHB0oa70fjYBH52oQpdvVXR56R5kdHqfeC1i0e+Eewoq22n7TZ\nuTL5VOUcMQKBgQDQ/8swjTdQxgxsQf9O4MXBB74hNaT9nEwPJagEQCk7eL6ns+MP\nEV5+I/OO9r3rr3e4LfJjYHrmNgoV5SzHq4egmpbb+T6khFMGas3PLnah2mxBvUDI\n9doH2oOhRDPt+wRbeTyeZXf1zqGD7FBDxOBnxdIUv9pKolSiaNnPKs9/dwKBgA8a\nUugsMpAKKW/i5hAoAOhFkUCyrNpw9Eaz70T3Jkt/rBEMrX8uldz9OLFOXXPaxStw\ndVhJissvIPUOu3sbCvr9+X6YCOQ6ggImU6RXM86j8syFJdZ1SYk89tgzIBw9OHRt\nHuQFbCDlzzwBvu/h+9fN8CuHL3Gnod5cCMLy1N+BAoGACatbOf54U1GhowTmJjYS\n8a0KvIRHStGY+JbcKeOPKsd6UKB8FKFpm8lvsrfIMFYUWKlNxraWRpN9nHScEeAP\nT9pufbgzmDckDXo2a8B65Yb7h3JVFE5MeVLg5/PY+WrYo98TSQkhMZZerKEYamw1\nyztpuvC5xC4kpXGUxZ0Ue0U=\n-----END PRIVATE KEY-----\n",
    client_email: "givespace-site@givespace.iam.gserviceaccount.com",
    client_id: "113646377145779829021",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/givespace-site%40givespace.iam.gserviceaccount.com",
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
