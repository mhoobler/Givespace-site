import express from "express";
import * as path from "path";
import { createServer } from "http";
import db from "./db";
import { fullCatalogueQuery } from "./utils/sqlQueries";
import { QueryResult } from "pg";
import { Catalogue, ViewProps } from "./types";

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

app.get("/catalogues", async (_req, res) => {
  res.status(200).render("index");
});

// create an app.get that accepts two different urls like /api/users and /api/posts

app.get(
  ["/ctg/:catalogue_id/:listing_id", "/ctg/:catalogue_id"],
  async (req, res) => {
    const params = req.params;
    // get the query strings from the url
    const queryStrings = req.query;
    let viewProps: ViewProps;
    try {
      const query: QueryResult<Catalogue> = await db.query(
        fullCatalogueQuery(
          `WHERE ${queryStrings.edit ? "edit_id" : "id"} = '${
            params.catalogue_id
          }'`
        )
      );
      if (!query.rows.length) {
        viewProps = {
          title: "Catalogue not found",
          description: "Catalogue not found",
          image_url:
            "https://storage.googleapis.com/givespace-pictures/Logo.svg",
          color: "#c9042c",
        };
        res.status(200).render("list", viewProps);
      } else {
        const catalogue: Catalogue = query.rows[0];
        if (!params.listing_id) {
          let imageToPass: string;
          if (catalogue.header_image_url) {
            imageToPass = catalogue.header_image_url;
          } else {
            if (catalogue.listings && catalogue.listings.length) {
              const listingImage = catalogue.listings.find(
                (listing) => listing.image_url
              );
              if (listingImage) {
                imageToPass = listingImage.image_url;
              } else {
                imageToPass =
                  "https://storage.googleapis.com/givespace-pictures/Logo.svg";
              }
            }
          }

          viewProps = {
            title: catalogue.title || "Undefined Catalogue",
            description:
              catalogue.description ||
              `Catalogue created ${
                new Date(catalogue.created).toISOString().split("T")[0]
              }`,
            image_url: imageToPass,
            color: catalogue.header_color || "#c9042c",
          };
          res.status(200).render("list", viewProps);
        } else {
          const listing = catalogue.listings.find(
            (listing) => listing.id === params.listing_id
          );
          if (!listing) {
            viewProps = {
              title: "Listing not found",
              description: "Listing not found or no longer exists",
              image_url:
                "https://storage.googleapis.com/givespace-pictures/Logo.svg",
              color: "#c9042c",
            };
            res.status(200).render("list", viewProps);
          } else {
            let imageToPass: string;
            if (listing.image_url) {
              imageToPass = listing.image_url;
            } else {
              if (catalogue.header_image_url) {
                imageToPass = catalogue.header_image_url;
              } else {
                imageToPass =
                  "https://storage.googleapis.com/givespace-pictures/Logo.svg";
              }
            }
            viewProps = {
              title: listing.name || "Unamed Listing",
              description:
                listing.description ||
                `Listing created ${
                  new Date(listing.created).toISOString().split("T")[0]
                }`,
              image_url: imageToPass,
              color: catalogue.header_color || "#c9042c",
            };
            res.status(200).render("list", viewProps);
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
