import fetch from "node-fetch";
import cheerio from "cheerio";
import { ScrapedFeatures } from "types";

export const generalScraper = async (
  url: string,
  html?: string
): Promise<ScrapedFeatures> => {
  if (!html) {
    const res = await fetch(url);
    html = await res.text();
  }

  const $ = cheerio.load(html);
  let metaItems = {
    item_url: url,
    name: null,
    description: null,
    image_url: null,
    price: null,
  };

  // clean price string and covert to float

  const parsePrice = (priceRaw) => {
    // get rid of all characers except numbers and . and ,
    return parseFloat(priceRaw.replace(/[^0-9.,]/g, "").replace(",", "."));
  };

  try {
    let title =
      $("meta[property='og:title']").attr("content") ||
      $("title").text() ||
      $('meta[name="title"]').attr("content");
    title = $("h1").attr("class") ? $("h1").text() : title;
    // get rid of title whitespace
    if (title) metaItems.name = title.trim().slice(0, 70);
  } catch (e) {}
  try {
    const description = $("meta[name='description']").attr("content");
    if (description) metaItems.description = description.trim().slice(0, 200);
  } catch (e) {}
  try {
    const image =
      $("meta[property='og:image']").attr("content") ||
      $("meta[property='og:image:url']").attr("content");
    if (image) metaItems.image_url = image;
  } catch (e) {}
  try {
    // price meta ta
    const priceRaw =
      $("meta[property='og:price:amount']").attr("content") ||
      $("meta[property='product:price:amount']").attr("content");
    let price: number;
    if (price) price = parsePrice(priceRaw);
    if (!price) {
      const priceFromHTML = $("span")
        .text()
        .match(/\$\d+\.\d+/);
      price = parsePrice(priceFromHTML[0]);

      if (price !== null || price === 0) {
        const prices = $("span")
          .text()
          .match(/\$\d+\.\d+/)
          .input.split("$");
        prices.shift();
        price = parsePrice(prices.find((p) => parsePrice(p)));
      }
    }

    if (price) metaItems.price = parseFloat(price.toFixed(2));
  } catch (e) {}
  const domain = url.split("/")[2];
  console.log(domain, metaItems);
  return metaItems;
};
