import express from "express";
import * as path from "path";
import { createServer } from "http";
import db from "./db";

const app = express();

//if (process.env.NODE_ENV === "development") {
//  const webpack = require("webpack");
//  const webpackDevMiddleware = require("webpack-dev-middleware");
//
//  const config = require("../webpack.middle.js");
//  const compiler = webpack(config);
//
//  app.use(
//    webpackDevMiddleware(compiler, {
//      publicPath: config.output.publicPath,
//    })
//  );
//}

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.get("*", (req, _res, next) => {
  console.log(req.path);
  next();
});

app.use(express.static(path.resolve(__dirname, "build")));

app.get("/", async (_req, res) => {
  res.status(200).render("index");
});

app.get("/list/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const query = await db.query(
      `SELECT title FROM catalogues WHERE id = $1;`,
      [id],
    );
    const { title } = query.rows[0];

    res.status(200).render("list", { og_title: title });
  } catch (err) {
    res.status(500);
  }
});

const httpServer = createServer(app);

export { app, httpServer };
