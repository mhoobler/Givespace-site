import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT || 3001;

console.log("index.ts is run");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../../client/build")));
} else {
  dotenv.config();
}

import db from "./db";

app.get("*", async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query("SELECT * FROM catalogues");
    console.log(rows);
    res.send({ message: rows });
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, () => {
  console.log("app.listening");
});
