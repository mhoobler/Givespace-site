import { ScrapedFeatures } from "../types";

const fetch = require("node-fetch");
const cheerio = require("cheerio");

const scrapeItemFeatures = async (name: string): Promise<ScrapedFeatures> => {
  const formattedItem = encodeURIComponent(name).replace(/%20/g, "+");
  const URL = `https://www.amazon.com/s?k=${formattedItem}&ref=nb_sb_noss_2`;
  const amazon_res = await fetch(URL);
  const html = await amazon_res.text();
  console.log(html.length);
  const $ = cheerio.load(html);
  const head = $(".s-asin");
  let features;
  head.each((i, item) => {
    const isSponsored = $(item).find(".s-label-popover-default").length > 0;
    if (!isSponsored && !features) {
      const img = $(item).find(".s-image").attr("src");
      const itemName = $(item).find("h2 span").text();
      // remove all commas from a string

      const price = parseFloat(
        $(item).find(".a-price-whole").text().replace(",", "")
      );
      const itemURL = `https://www.amazon.com${$(item)
        .find(".a-link-normal")
        .attr("href")}`;

      features = {
        image_url: img,
        item_url: itemURL,
        name: itemName,
        price: price ? price : 0,
      };
    }
  });

  console.log("features", features);
  return features;
};

export default scrapeItemFeatures;
