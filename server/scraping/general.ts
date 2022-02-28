import fetch from "node-fetch";
import cheerio, { Cheerio } from "cheerio";
import { ScrapedFeatures } from "../types";
import { isUrl } from "../utils/functions";
import { UserInputError } from "apollo-server-express";

export const generalScraper = async (
  url: string,
  html?: string
): Promise<ScrapedFeatures> => {
  if (!html) {
    const res = await fetch(url);
    if (!res.ok) throw new UserInputError("Invalid URL or item name");
    // get res status
    console.log("res.status", res.status);
    html = await res.text();
  }

  const $ = cheerio.load(html);
  let scrapedFeatures: ScrapedFeatures = {
    item_url: url,
    name: null,
    description: null,
    image_url: null,
    price: null,
  };

  // clean price string and covert to float

  const parsePrice = (priceRaw: string) => {
    // get rid of all characers except numbers and . and ,
    if (!priceRaw) return null;
    return parseFloat(priceRaw.replace(/[^0-9.,]/g, "").replace(",", "."));
  };

  try {
    let title =
      $("meta[property='og:title']").attr("content") ||
      $("title").text() ||
      $('meta[name="title"]').attr("content");
    title = $("h1").attr("class") ? $("h1").text() : title;
    // get rid of title whitespace and whitespace characters and special characters
    title = title.replace(/\s+/g, " ").trim().slice(0, 70);
    if (title) scrapedFeatures.name = title;
  } catch (e) {}
  try {
    let description = $("meta[name='description']").attr("content");
    description = description.replace(/\s+/g, " ").trim().slice(0, 200);
    if (description) scrapedFeatures.description = description;
  } catch (e) {
    console.log(e);
  }
  try {
    let image =
      $("meta[property='og:image']").attr("content") ||
      $("meta[property='og:image:url']").attr("content");
    if (!image) {
      const images = $("img");
      console.log(images.length);
      for (let i = 0; i < images.length; i++) {
        try {
          const currImage = images[i];

          // from attributes
          const width = $(currImage).attr("width");
          const height = $(currImage).attr("width");
          if (width && height) {
            const ratio = Math.max(
              parseFloat(width) / parseFloat(height),
              parseFloat(height) / parseFloat(width)
            );
            if (
              parseFloat(width) > 300 &&
              parseFloat(height) > 300 &&
              ratio < 3
            ) {
              image = $(currImage).attr("src");
              // break;
            }
          } else if (
            (parseFloat(width) && parseFloat(width) > 300) ||
            (parseFloat(height) && parseFloat(height) > 300)
          ) {
            image = $(currImage).attr("src");
            // break;
          }

          // from style
          const styleString = $(currImage).attr("style");
          // parse the style string into an object
          if (styleString) {
            const styleObj = styleString
              .split(";")
              .map((style) => {
                const [key, value] = style.split(":");
                return { [key]: value };
              })
              .reduce((acc, curr) => {
                return { ...acc, ...curr };
              });
            // if a key in styleObj contains "width" then save the value
            let width;
            let height;
            const widthKey = Object.keys(styleObj).find((key) =>
              key.toLocaleLowerCase().includes("width")
            );
            if (widthKey) {
              width = parseFloat(styleObj[widthKey]);
            }
            const heightKey = Object.keys(styleObj).find((key) =>
              key.toLocaleLowerCase().includes("height")
            );
            if (heightKey) {
              height = parseFloat(styleObj[heightKey]);
            }
            if ((width && width > 300) || (height && height > 300)) {
              image = $(currImage).attr("src");
              break;
            }
          }
        } catch (e) {}
      }
    }

    if (image) {
      if (!isUrl(image)) {
        try {
          image = url.split("/").slice(0, 3).join("/") + image;
        } catch (e) {
          console.log("error", e);
        }
      }
      scrapedFeatures.image_url = image;
    }
  } catch (e) {}
  try {
    // price meta ta
    let price =
      $("meta[property='og:price:amount']").attr("content") ||
      $("meta[property='product:price:amount']").attr("content");
    const getPriceFromObj = (cheerioObj: any): string | undefined => {
      let price: string;
      try {
        const newPrice = cheerioObj.text().match(/\$\d+/)[0];
        if (parsePrice(newPrice)) price = newPrice;
      } catch (e) {}
      try {
        const prices = cheerioObj
          .text()
          .match(/\$\d+\.\d+/)
          .input.split("$");
        prices.shift();
        const newPrice = prices.find((p) => parsePrice(p));
        if (parsePrice(newPrice)) price = newPrice;
      } catch (e) {}
      try {
        const newPrice = cheerioObj.text().match(/\$\d+\.\d+/)[0];
        if (parsePrice(newPrice)) price = newPrice;
      } catch (e) {}

      return price;
    };
    if (!price) {
      let priceFromHTML;
      if (!priceFromHTML) {
        priceFromHTML = getPriceFromObj($("span"));
      }
      if (!priceFromHTML) {
        priceFromHTML = getPriceFromObj($("p"));
      }

      price = priceFromHTML;
    }
    const priceNum: number = parseFloat(parsePrice(price).toFixed(2));
    if (price) scrapedFeatures.price = priceNum;
  } catch (e) {
    console.log("error", e);
  }

  return scrapedFeatures;
};
