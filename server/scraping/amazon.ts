import fetch from "node-fetch";
import cheerio from "cheerio";
import { ScrapedFeatures } from "types";

export const scrapeListingByName = async (
  name: string
): Promise<ScrapedFeatures> => {
  const formattedItem = encodeURIComponent(name).replace(/%20/g, "+");
  const URL = `https://www.amazon.com/s?k=${formattedItem}&ref=nb_sb_noss_2`;
  const amazon_res = await fetch(URL);
  const html = await amazon_res.text();
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
        description: null,
      };
    }
  });

  return features;
};

export const scrapeListingByUrl = async (
  url: string
): Promise<ScrapedFeatures> => {
  // fetch the item name, price, and image url from an amazon link
  const amazon_res = await fetch(url);
  const html = await amazon_res.text();
  const $ = cheerio.load(html);
  const image = $("#imgTagWrapperId img").attr("src");
  const name = $("#productTitle").text().replace(/\s\s+/g, " ").trim();
  // get rid of name whitespace
  // get the price from an amazon item from the items page

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
    price: price ? price : 0,
    description: null,
  };
};
