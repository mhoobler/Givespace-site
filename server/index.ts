import express, { Request, Response } from "express";
import path from "path";

const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../../client/build")));
}

app.listen(3001, () => {
  console.log("app.listening");
});
