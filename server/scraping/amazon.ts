import fetch from "node-fetch";
import cheerio from "cheerio";
import { ScrapedFeatures } from "../types";
import { UserInputError } from "apollo-server-express";

export const scrapeListingByName = async (
  name: string
): Promise<ScrapedFeatures> => {
  const timeStart = Date.now();
  const formattedItem = encodeURIComponent(name).replace(/%20/g, "+");
  const URL = `https://www.amazon.com/s?k=${formattedItem}&ref=nb_sb_noss_2`;
  const amazon_res = await fetch(URL);
  const html = await amazon_res.text();
  const $ = cheerio.load(html);
  const head = $(".s-asin");
  let features: ScrapedFeatures;
  for (let i = 0; i < head.length; i++) {
    const item = head[i];
    const isSponsored = $(item).find(".s-label-popover-default").length > 0;
    if (!isSponsored && !features) {
      const img = $(item).find(".s-image").attr("src");
      const itemName = $(item).find("h2 span").text();

      const price = parseFloat(
        $(item).find(".a-price-whole").text().replace(",", "")
      );
      const itemURL = `https://www.amazon.com${$(item)
        .find(".a-link-normal")
        .attr("href")}`;

      // the price of description if a 3 second delay
      // features = await scrapeListingByUrl(itemURL);
      features = {
        item_url: itemURL,
        name: itemName,
        image_url: img,
        price: price || null,
        description: null,
      };
      break;
    }
  }

  const timeEnd = Date.now();
  console.log(`Scraping ${name} took ${timeEnd - timeStart}ms`);
  console.log(features);

  return features;
};

export const scrapeListingByUrl = async (
  url: string
): Promise<ScrapedFeatures> => {
  // fetch the item name, price, and image url from an amazon link
  const amazon_res = await fetch(url);
  if (!amazon_res.ok) throw new UserInputError("Invalid URL or item name");

  const html = await amazon_res.text();
  const $ = cheerio.load(html);
  const image = $("#imgTagWrapperId img").attr("src");
  const name = $("#productTitle").text().replace(/\s\s+/g, " ").trim();
  const description = $("#feature-bullets")
    .find("ul")
    .first()
    .find("li")
    .slice(1, -1)
    .text()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);

  let price;
  const priceRaw = $("#corePrice_desktop div table tbody span.apexPriceToPay")
    .eq(0)
    .text();

  price = parseFloat(priceRaw.split("$")[1]);
  if (!price) {
    const newPriceRaw = $(".a-price-whole").eq(0).text();
    price = parseFloat(newPriceRaw);
  }

  return {
    image_url: image,
    item_url: url,
    name,
    price: price || 0,
    description,
  };
};
