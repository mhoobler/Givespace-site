import cheerio from "cheerio";
import fetch from "node-fetch";

type MetaItems = {
  icon: string | null;
  title: string | null;
  description: string | null;
  image: string | null;
};
export const getMetaItems = async (
  url: string,
  html?: string | null
): Promise<MetaItems> => {
  console.log("start");
  if (!html) {
    const res = await fetch(url);
    html = await res.text();
  }
  console.log("next");

  const $ = cheerio.load(html);
  let metaItems: MetaItems = {
    icon: `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=256`,
    title: null,
    description: null,
    image: null,
  };
  try {
    const icon =
      $("link[rel='icon']").attr("href") ||
      $('link[rel="shortcut icon"]').attr("href");
    if (icon) metaItems.icon = icon;
  } catch (e) {}
  try {
    const title =
      $("meta[property='og:title']").attr("content") ||
      $("title").text() ||
      $('meta[name="title"]').attr("content");
    if (title) metaItems.title = title;
  } catch (e) {}
  try {
    const description =
      $("meta[property='og:description]'").attr("content") ||
      $("meta[name='description']").attr("content");
    if (description) metaItems.description = description;
  } catch (e) {}
  try {
    const image =
      $("meta[property='og:image']").attr("content") ||
      $("meta[property='og:image:url']").attr("content");
    if (image) metaItems.image = image;
  } catch (e) {}

  console.log(metaItems);
  return metaItems;
};
