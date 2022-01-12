import express, { Request, Response } from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../../client/build")));
}

app.listen(PORT, () => {
  console.log("app.listening");
});
