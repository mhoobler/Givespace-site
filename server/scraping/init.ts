import { ScrapedFeatures } from "../types";
import { isUrl } from "../utils/functions";
import { scrapeListingByName, scrapeListingByUrl } from "./amazon";
import { generalScraper } from "./general";

const scrapeListing = async (text: string): Promise<ScrapedFeatures> => {
  let features;
  try {
    if (isUrl(text)) {
      if (text.includes(".amazon.co")) {
        features = await scrapeListingByUrl(text);
      } else {
        features = await generalScraper(text);
      }
    } else {
      features = await scrapeListingByName(text);
    }
    if (features.name.length === 70) {
      const newName = features.name.slice(0, 70).split(" ");
      newName.pop();
      features.name = newName.join(" ") + "...";
    }
  } catch (err) {
    console.log(err);
    features = {
      image_url: null,
      item_url: null,
      name: null,
      price: null,
      description: null,
    };
  }
  return features;
};

export default scrapeListing;
