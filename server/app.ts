import express from "express";
import * as path from "path";
import { createServer } from "http";
import db from "./db";
import { fullCatalogueQuery } from "./utils/sqlQueries";
import { QueryResult } from "pg";
import { Catalogue } from "./types";

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

app.get("/lists", async (_req, res) => {
  res.status(200).render("index");
});

// create an app.get that accepts two different urls like /api/users and /api/posts

app.get(
  ["/list/:catalogue_id/:listing_id", "/list/:catalogue_id"],
  async (req, res) => {
    const params = req.params;
    // get the query strings from the url
    const queryStrings = req.query;
    try {
      const query: QueryResult<Catalogue> = await db.query(
        fullCatalogueQuery(
          `WHERE ${queryStrings.edit ? "edit_id" : "id"} = '${
            params.catalogue_id
          }'`
        )
      );
      if (!query.rows.length) {
        res
          .status(200)
          .render("list", {
            title: "Catalogue not found",
            description: "Catalogue not found",
          });
      } else {
        const catalogue: Catalogue = query.rows[0];
        if (!params.listing_id) {
          res.status(200).render("list", {
            title: catalogue.title || "Untitled Catalogue",
            description: `Catalogue "${catalogue.title}" contains ${
              catalogue.listings ? catalogue.listings.length : "no"
            } listings`,
          });
        } else {
          const listing = catalogue.listings.find(
            (listing) => listing.id === params.listing_id
          );
          if (!listing) {
            res.status(200).render("list", {
              title: "Listing not found",
              description: "Listing no longer exists",
            });
          } else {
            res.status(200).render("list", {
              title: listing.name,
              description: `Listing "${listing.name}" in catalogue "${catalogue.title}"`,
            });
          }
        }
      }
    } catch (err) {
      res.status(500);
    }
  }
);

const httpServer = createServer(app);

export { app, httpServer };
